import { 
  getAuth, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { render as loginRender } from "./login.js";

export function render(container) {

  const db = getFirestore();
  const auth = getAuth();
  const user = localStorage.getItem("familyUser");

  container.innerHTML = `
    <div style="padding:20px; position:relative;">
      <h2>家族チャット</h2>

      <div style="
        position:absolute;
        top:20px;
        right:20px;
        display:flex;
        gap:10px;
        align-items:center;
      ">
        <span style="font-size:14px;color:#aaa;">${user}</span>
        <button id="logoutBtn" style="
          background:#333;
          color:white;
          border:none;
          padding:6px 12px;
          border-radius:8px;
          cursor:pointer;
        ">
          ログアウト
        </button>
      </div>

      <div id="messages" style="
        height:400px;
        overflow:auto;
        border:1px solid #333;
        padding:10px;
        background:#1e1e1e;
        margin-top:20px;
      "></div>

      <div style="margin-top:10px;">
        <input id="msgInput" placeholder="メッセージ" style="
          padding:8px;
          width:70%;
          border-radius:6px;
          border:none;
        ">
        <button id="sendBtn" style="
          padding:8px 14px;
          border:none;
          border-radius:6px;
          background:#444;
          color:white;
          cursor:pointer;
        ">
          送信
        </button>
      </div>
    </div>
  `;

  // 🔥 ログアウト処理
  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    localStorage.removeItem("familyUser");
    loginRender(container);
  });

  const messagesDiv = document.getElementById("messages");
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt"));

  // 🔥 リアルタイム表示
  onSnapshot(q, snapshot => {
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const msg = document.createElement("div");

      msg.style.marginBottom = "8px";
      msg.innerHTML = `
        <strong>${data.user}</strong>: ${data.text}
      `;
      messagesDiv.appendChild(msg);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // 🔥 送信処理
  document.getElementById("sendBtn").addEventListener("click", async () => {

    const input = document.getElementById("msgInput");
    const text = input.value.trim();

    if (!text) return;

    await addDoc(messagesRef, {
      user: user,
      text: text,
      createdAt: serverTimestamp()
    });

    input.value = "";
  });
}
