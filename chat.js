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

  const messageMap = {};

  // ログイン
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

  // リロード復元
  if (currentUser) {
    cardContainer.style.display = "none";
    chatView.style.display = "block";
    usernameDisplay.textContent = currentUser;
    loadMessages();
  }

  // ログアウト
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    location.reload();
  });

  // UI生成
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

  function updateReadText(readElement, readBy) {

    if (!readBy) {
      readElement.textContent = "";
      return;
    }

    const readCount = Object.keys(readBy).length - 1;

    if (readCount > 0) {
      readElement.textContent = "既読 " + readCount;
    } else {
      readElement.textContent = "";
    }
  }

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

  function loadMessages() {

    messages.innerHTML = "";
    Object.keys(messageMap).forEach(key => delete messageMap[key]);

    chatRef.off();

    chatRef.on("value", function(snapshot){

      messages.innerHTML = "";
      Object.keys(messageMap).forEach(key => delete messageMap[key]);

      snapshot.forEach(function(child){

        const key = child.key;
        const data = child.val();
        if (!data) return;

        if (!data.readBy || !data.readBy[currentUser]) {
          chatRef.child(key
