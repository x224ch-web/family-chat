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
  // 🔔 639Hz通知音
  const notificationSound = new Audio("639hz.mp3");
  notificationSound.preload = "auto";
  notificationSound.volume = 1.0;
  // 🔓 最初のタップで音を有効化
document.addEventListener("click", () => {
  notificationSound.play().then(() => {
    notificationSound.pause();
    notificationSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });
  
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

  let lastMessageCount = 0;

onSnapshot(q, snapshot => {

  const currentCount = snapshot.size;

  // 🔥 新着判定（初回は鳴らさない）
  if (lastMessageCount !== 0 && currentCount > lastMessageCount) {

    const latestDoc = snapshot.docs[snapshot.docs.length - 1];
    const latestData = latestDoc.data();

    // 🔥 自分の送信は鳴らさない
    if (latestData.user !== user) {
      notificationSound.currentTime = 0;
      notificationSound.play();
      showLocalNotification(latestData.user, latestData.text);
    }
  }

  import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function render(container) {

  const db = getFirestore();
  const auth = getAuth();
  const user = localStorage.getItem("familyUser");

  if (!user) {
    container.innerHTML = "<h2>ログインしてください</h2>";
    return;
  }

  container.innerHTML = `
    <div class="chat-wrapper">
      <div class="chat-header">
        <h2>家族チャット</h2>
        <button id="logoutBtn">ログアウト</button>
      </div>

      <div id="messages" class="messages"></div>

      <div class="input-area">
        <input id="msgInput" placeholder="メッセージ">
        <button id="sendBtn">送信</button>
      </div>
    </div>
  `;

  const messagesEl = container.querySelector("#messages");
  const input = container.querySelector("#msgInput");

  const chatRef = collection(db, "chat");
  const q = query(chatRef, orderBy("createdAt"));

  // 🔥 リアルタイム取得
  onSnapshot(q, async (snapshot) => {

    messagesEl.innerHTML = "";

    snapshot.forEach(docSnap => {

      const data = docSnap.data();
      const isMe = data.user === user;

      const time = data.createdAt
        ? new Date(data.createdAt.seconds * 1000)
            .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";

      messagesEl.innerHTML += `
        <div class="message-row ${isMe ? "me" : "other"}">
          
          ${!isMe ? `<div class="meta">${data.user}</div>` : ""}

          <div class="bubble">
            ${data.text}
          </div>

          <div class="info">
            ${isMe ? `<span class="read">${data.read ? "既読" : ""}</span>` : ""}
            <span class="time">${time}</span>
          </div>

        </div>
      `;

      // 🔥 他人メッセージを既読更新
      if (!isMe && !data.read) {
        updateDoc(doc(db, "chat", docSnap.id), {
          read: true
        });
      }

    });

    messagesEl.scrollTop = messagesEl.scrollHeight;

  });

  // 🔥 送信
  container.querySelector("#sendBtn").addEventListener("click", async () => {

    if (!input.value.trim()) return;

    await addDoc(chatRef, {
      user: user,
      text: input.value,
      createdAt: serverTimestamp(),
      read: false
    });

    input.value = "";
  });

  // Enter送信
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      container.querySelector("#sendBtn").click();
    }
  });

  // ログアウト
  container.querySelector("#logoutBtn").addEventListener("click", async () => {
    await signOut(auth);
    localStorage.removeItem("familyUser");
    location.reload();
  });
}

 
