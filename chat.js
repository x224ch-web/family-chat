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

  // メッセージDOMを保持（再描画防止用）
  const messageMap = {};

  /* =========================
     ログイン処理
  ========================= */
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

  /* =========================
     リロード復元
  ========================= */
  if (currentUser) {
    cardContainer.style.display = "none";
    chatView.style.display = "block";
    usernameDisplay.textContent = currentUser;
    loadMessages();
  }

  /* =========================
     ログアウト
  ========================= */
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    location.reload();
  });

  /* =========================
     メッセージUI生成
  ========================= */
  function createMessageElement(key, text, user, time, readBy = {}) {

    const row = document.createElement("div");
    row.classList.add("message-row");
    row.dataset.key = key;

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
      read.classList.add("read-status");

      updateReadText(read, readBy);

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

    return row;
  }

  /* =========================
     既読表示更新
  ========================= */
  function updateReadText(readElement, readBy) {

    if (!readBy) {
      readElement.textContent = "";
      return;
    }

    const readCount = Object.keys(readBy).length - 1; // 自分除外

    if (readCount > 0) {
      readElement.textContent = "既読 " + readCount;
    } else {
      readElement.textContent = "";
    }
  }

  /* =========================
     送信
  ========================= */
  function sendMessage() {

    const text = input.value.trim();
    if (!text || !currentUser) return;

    chatRef.push({
      text: text,
      name: currentUser,
      timestamp: Date.now(),
      readBy: {
        [currentUser]: true
      }
    });

    input.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  /* =========================
     Firebase読込
  ========================= */
  function loadMessages() {

    messages.innerHTML = "";
    messageMap.clear?.(); // 旧ブラウザ対策

    chatRef.limitToLast(100).off();

    // 追加
    chatRef.limitToLast(100).on("child_added", function (snapshot) {

      const data = snapshot.val();
      if (!data) return;

      const key = snapshot.key;

      // 既読登録
      if (!data.readBy || !data.readBy[currentUser]) {
        chatRef.child(key).child("readBy").update({
          [currentUser]: true
        });
      }

      const time = new Date(data.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const element = createMessageElement(
        key,
        data.text,
        data.name,
        time,
        data.readBy
      );

      messageMap[key] = element;
      messages.appendChild(element);
      messages.scrollTop = messages.scrollHeight;
    });

    // 🔥 既読更新リアルタイム
    chatRef.limitToLast(100).on("value", function(snapshot){

  snapshot.forEach(function(child){

    const key = child.key;
    const data = child.val();
    if (!data) return;

    const element = messageMap[key];
    if (!element) return;

    if (data.name === currentUser) {
      const readEl = element.querySelector(".read-status");
      if (readEl) {
        updateReadText(readEl, data.readBy);
      }
    }

  });

});
