document.addEventListener("DOMContentLoaded", function () {

  const input = document.querySelector(".input-area input");
  const sendBtn = document.querySelector(".input-area button");
  const messages = document.querySelector(".messages");

  if (!input || !sendBtn || !messages) return;

  const currentUser = localStorage.getItem("currentUser") || "unknown";
  const chatRef = firebase.database().ref("messages");

  function addMessageToUI(text, user, time) {

    const row = document.createElement("div");
    const type = user === currentUser ? "me" : "other";
    row.className = "message-row " + type;

    if (type === "other") {
      const name = document.createElement("div");
      name.className = "sender-name";
      name.innerText = user;
      row.appendChild(name);
    }

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerText = text;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerText = time;

    row.appendChild(bubble);
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

  // Enter送信
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });

  // 受信
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
