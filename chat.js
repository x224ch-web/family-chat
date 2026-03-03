document.addEventListener("DOMContentLoaded", function () {

  const cards = document.querySelectorAll(".card");
  const cardContainer = document.querySelector(".card-container");
  const chatView = document.getElementById("chat-view");
  const usernameDisplay = document.getElementById("chat-username");
  const logoutBtn = document.getElementById("logoutBtn");

  const input = document.querySelector(".input-area input");
  const sendBtn = document.querySelector(".input-area button");
  const messages = document.querySelector(".messages");

  const chatRef = firebase.database().ref("messages");

  let currentUser = localStorage.getItem("currentUser");

  // =========================
  // ログイン処理
  // =========================
  cards.forEach(card => {
    card.addEventListener("click", function () {

      const user = card.dataset.user;
      currentUser = user;

      localStorage.setItem("currentUser", user);

      cardContainer.style.display = "none";
      chatView.style.display = "block";
      usernameDisplay.textContent = user;

      loadMessages();
    });
  });

  // =========================
  // ページ再読み込み時復元
  // =========================
  if (currentUser) {
    cardContainer.style.display = "none";
    chatView.style.display = "block";
    usernameDisplay.textContent = currentUser;
    loadMessages();
  }

  // =========================
  // ログアウト
  // =========================
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    location.reload();
  });

  // =========================
  // メッセージ表示
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

      row.classList.add("other");

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.flexDirection = "column";

      const nameEl = document.createElement("div");
      nameEl.classList.add("sender-name");
      nameEl.textContent = user;

      wrapper.appendChild(nameEl);
      wrapper.appendChild(bubble);

      row.appendChild(wrapper);
      row.appendChild(timeEl);
    }

    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  // =========================
  // 送信
  // =========================
  function sendMessage() {

    const text = input.value.trim();
    if (!text || !currentUser) return;

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
  // Firebase読込
  // =========================
  function loadMessages() {

    messages.innerHTML = "";

    chatRef.limitToLast(100).off();

    chatRef.limitToLast(100).on("child_added", function (snapshot) {

      const data = snapshot.val();
      if (!data) return;

      const time = new Date(data.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      addMessageToUI(data.text, data.name, time);
    });
  }

});
