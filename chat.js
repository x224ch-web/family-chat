document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // 要素取得
  // =========================
  const input = document.querySelector(".input-area input");
  const sendBtn = document.querySelector(".input-area button");
  const messages = document.querySelector(".messages");

  if (!input || !sendBtn || !messages) {
    console.error("必要な要素が見つかりません");
    return;
  }

  // =========================
  // ユーザー取得（重要）
  // =========================
  const currentUser = localStorage.getItem("currentUser");

  console.log("currentUser:", currentUser);

  if (!currentUser) {
    alert("ユーザー情報がありません。ログイン画面に戻ります。");
    window.location.href = "index.html";
    return;
  }

  // =========================
  // Firebase参照
  // =========================
  const chatRef = firebase.database().ref("messages");

  // =========================
  // UIに追加する関数
  // =========================
  function addMessageToUI(text, user, time) {

    const row = document.createElement("div");
    row.classList.add("message-row");

    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.textContent = text;

    const timeEl = document.createElement("div");
    timeEl.classList.add("time");
    timeEl.textContent = time;

    // ===== 自分 =====
    if (user === currentUser) {

      row.classList.add("me");

      const meta = document.createElement("div");
      meta.classList.add("meta-vertical");

      const read = document.createElement("div");
      read.textContent = "既読";

      meta.appendChild(read);
      meta.appendChild(timeEl);

      row.appendChild(meta);
      row.appendChild(bubble);

    } else {

      // ===== 他人 =====
      row.classList.add("other");

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";

      const nameEl = document.createElement("div");
      nameEl.classList.add("sender-name");
      nameEl.textContent = user || "unknown";

      wrapper.appendChild(nameEl);
      wrapper.appendChild(bubble);

      row.appendChild(wrapper);
      row.appendChild(timeEl);
    }

    messages.appendChild(row);

    // 自動スクロール
    messages.scrollTop = messages.scrollHeight;
  }

  // =========================
  // 送信処理
  // =========================
  function sendMessage() {

    const text = input.value.trim();
    if (!text) return;

    chatRef.push({
      text: text,
      name: currentUser,
      timestamp: Date.now()
    });

    input.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // =========================
  // 受信処理
  // =========================
  chatRef.limitToLast(100).on("child_added", function (snapshot) {

    const data = snapshot.val();
    if (!data) return;

    const time = new Date(data.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    addMessageToUI(data.text, data.name, time);
  });

});
