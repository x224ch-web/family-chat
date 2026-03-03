document.addEventListener("DOMContentLoaded", function () {

  console.log("chat.js loaded");

  const database = firebase.database();
  const messaging = firebase.messaging();

  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    console.log("ログインユーザーなし");
    return;
  }

  // =========================
  // 🔔 通知許可 & トークン取得
  // =========================
  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {

        const token = await messaging.getToken({
          vapidKey: "ここにあなたのVAPIDキーを貼る"
        });

        if (token) {
          console.log("通知トークン:", token);

          await database.ref("users/" + currentUser).update({
            token: token
          });

        } else {
          console.log("トークン取得失敗");
        }

      } else {
        console.log("通知は拒否されました");
      }

    } catch (error) {
      console.error("通知エラー:", error);
    }
  }

  requestPermission();


  // =========================
  // 📩 フォアグラウンド通知
  // =========================
  messaging.onMessage(function(payload) {

    console.log("フォアグラウンド受信:", payload);

    if (!payload.notification) return;

    const title = payload.notification.title || "新しいメッセージ";
    const body = payload.notification.body || "";

    new Notification(title, {
      body: body,
      icon: "/icon.png"
    });

    // 🔊 通知音
    try {
      const audio = new Audio("639hz_notification_optimized.mp3");
      audio.play();
    } catch (e) {}
  });


  // =========================
  // 🧠 自分の投稿は通知しない用フラグ例
  // =========================
  // 将来的に payload.data.sender !== currentUser で制御可能

});
