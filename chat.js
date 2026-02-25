import { getDatabase, ref, push, onValue }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export function render(container) {

  container.innerHTML = `
    <div style="padding:20px;">
      <h2>家族チャット</h2>

      <div id="messages" style="
        height:400px;
        overflow:auto;
        border:1px solid #ddd;
        padding:10px;
        background:#fafafa;
      "></div>

      <div style="margin-top:10px;">
        <input id="msgInput" placeholder="メッセージ">
        <button id="sendBtn">送信</button>
      </div>
    </div>
  `;

  const db = getDatabase();
  const chatRef = ref(db, "chat");

  const messages = container.querySelector("#messages");
  const input = container.querySelector("#msgInput");

  const currentUser = localStorage.getItem("familyUser");

  container.querySelector("#sendBtn").onclick = () => {

    if (!input.value.trim()) return;

    push(chatRef, {
      text: input.value,
      user: currentUser,
      time: Date.now()
    });

    input.value = "";
  };

  onValue(chatRef, snapshot => {

    messages.innerHTML = "";

    snapshot.forEach(child => {

      const data = child.val();

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.margin = "6px 0";

      if (data.user === currentUser) {
        wrapper.style.justifyContent = "flex-end";
      } else {
        wrapper.style.justifyContent = "flex-start";
      }

      const bubble = document.createElement("div");

      bubble.style.padding = "10px 14px";
      bubble.style.borderRadius = "18px";
      bubble.style.maxWidth = "70%";
      bubble.style.wordBreak = "break-word";

      if (data.user === currentUser) {
        bubble.style.background = "#DCF8C6";
      } else {
        bubble.style.background = "#ffffff";
        bubble.style.border = "1px solid #ddd";
      }

      bubble.innerHTML = `
        <div style="font-size:12px;color:#555;">${data.user}</div>
        <div>${data.text}</div>
      `;

      wrapper.appendChild(bubble);
      messages.appendChild(wrapper);

    });

    messages.scrollTop = messages.scrollHeight;

  });

}
