import { getMessaging, getToken, onMessage } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";

import { getDatabase, ref, set } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {

  // 🔹 既存で初期化済みの app を使用
  const messaging = getMessaging();
  const database = getDatabase();

  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) return;

  // =========================
  // 🔔 通知許可 & トークン取得
  // =========================
  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {

        const token = await getToken(messaging, {
          vapidKey: "BDZGNKBy0aPMVOHb59ESyQo5XpxspSBs7axW8rEKqJouYTgdeVFfThQFeLIax9eMyubSBpQN4LHcBWmIz6PLUWw"
        });

        if (token) {
          console.log("通知トークン:", token);

          const userRef = ref(database, "users/" + currentUser);
          await set(userRef, { token: token });
        }

      } else {
        console.log("通知が拒否されました");
      }

    } catch (error) {
      console.error("通知取得エラー:", error);
    }
  }

  requestPermission();


  // =========================
  // 📩 フォアグラウンド通知
  // =========================
  onMessage(messaging, (payload) => {

    console.log("メッセージ受信:", payload);

    if (!payload.notification) return;

    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: "/icon.png"
    });

    // 🔊 通知音
    const audio = new Audio("639hz_notification_optimized.mp3");
    audio.play().catch(() => {});
  });

});
