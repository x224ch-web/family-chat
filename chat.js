document.addEventListener("DOMContentLoaded", function () {

  const input = document.querySelector(".input-area input");
  const sendBtn = document.querySelector(".input-area button");
  const messages = document.querySelector(".messages");
  const usernameEl = document.getElementById("chat-username");

  if (!input || !sendBtn || !messages) return;

  const db = firebase.database();
  const chatRef = db.ref("messages");

  const currentUser = localStorage.getItem("currentUser") || "unknown";

  function getTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, "0") + ":" +
           now.getMinutes().toString().padStart(2, "0");
  }

  function addMessageToUI(text, user, time) {

  const row = document.createElement("div");
  const type = user === currentUser ? "me" : "other";
  row.className = "message-row " + type;

  const contentWrapper = document.createElement("div");
  contentWrapper.style.display = "flex";
  contentWrapper.style.flexDirection = "column";

  // 他人の場合のみ名前表示
  if (type === "other") {
    const name = document.createElement("div");
    name.className = "sender-name";
    name.innerText = user;
    contentWrapper.appendChild(name);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerText = text;

  contentWrapper.appendChild(bubble);

  const meta = document.createElement("div");
  meta.className = "meta";

  if (type === "me") {
    meta.innerText = time + " 既読";
  } else {
    meta.innerText = time;
  }

  row.appendChild(contentWrapper);
  row.appendChild(meta);

  messages.appendChild(row);
  messages.scrollTop = messages.scrollHeight;
}

  // 送信
  sendBtn.addEventListener("click", function () {
    const text = input.value.trim();
    if (!text) return;

    chatRef.push({
  text: text,
  name: currentUser,
  timestamp: Date.now()
});

    input.value = "";
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendBtn.click();
  });

  // 受信（リアルタイム）
  chatRef.limitToLast(100).on("child_added", function (snapshot) {
  const data = snapshot.val();

  const user = data.name;
  const text = data.text;
  const time = new Date(data.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  addMessageToUI(text, user, time);
});
