import { getDatabase, ref, push, onValue }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export function render(container) {

  container.innerHTML = `
    <div style="padding:20px;">
      <h2>家族チャット</h2>

      <div id="messages" style="height:300px; overflow:auto; border:1px solid #ddd;"></div>

      <input id="msgInput" placeholder="メッセージ">
      <button id="sendBtn">送信</button>
    </div>
  `;

  const db = getDatabase();
  const chatRef = ref(db, "chat");

  const messages = container.querySelector("#messages");
  const input = container.querySelector("#msgInput");
  const sendBtn = container.querySelector("#sendBtn");

  sendBtn.onclick = () => {
    if (!input.value.trim()) return;

    const user = localStorage.getItem("familyUser") || "名無し";

push(chatRef, {
  text: input.value,
  user,
  time: Date.now()
});

    input.value = "";
  };

  onValue(chatRef, snapshot => {

    messages.innerHTML = "";

    snapshot.forEach(child => {
      const data = child.val();

      const div = document.createElement("div");
      div.textContent = `${data.user}：${data.text}`;

      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;

  });

}
