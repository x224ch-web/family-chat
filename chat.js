document.addEventListener("DOMContentLoaded", function () {

  const input = document.querySelector(".input-area input");
  const sendBtn = document.querySelector(".input-area button");
  const messages = document.querySelector(".messages");

  if (!input || !sendBtn || !messages) return;

  const currentUser = localStorage.getItem("currentUser") || "unknown";
  const chatRef = firebase.database().ref("messages");

  function addMessageToUI(data, currentUser) {

  const row = document.createElement("div");
  row.classList.add("message-row");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = data.text;

  const time = document.createElement("div");
  time.classList.add("time");

  if (data.user === currentUser) {

    // ===== 自分 =====
    row.classList.add("me");

    const meta = document.createElement("div");
    meta.classList.add("meta-vertical");

    const read = document.createElement("div");
    read.textContent = "既読"; // 後で本物にする

    meta.appendChild(read);
    meta.appendChild(time);

    row.appendChild(meta);
    row.appendChild(bubble);

  } else {

    // ===== 他人 =====
    row.classList.add("other");

    const name = document.createElement("div");
    name.classList.add("sender-name");
    name.textContent = data.user;

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";

    wrapper.appendChild(name);
    wrapper.appendChild(bubble);

    row.appendChild(wrapper);
    row.appendChild(time);
  }

  document.querySelector(".messages").appendChild(row);
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
