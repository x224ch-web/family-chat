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
   // 🔔 通知許可をもらう
  if ("Notification" in window) {
     Notification.requestPermission();
  }
   // 🎵 639Hz音
  const notificationSound = new Audio("639hz.mp3");
  notificationSound.volume = 1.0;
  // 🎵 最初のタップで音を解放
document.addEventListener("click", () => {
  notificationSound.play().then(() => {
    notificationSound.pause();
    notificationSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });
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
// 🔔 新しく追加されたメッセージだけ通知
snapshot.docChanges().forEach(change => {

  if (change.type === "added") {

    const data = change.doc.data();
    const isMe = data.user === user;

    if (!isMe && Notification.permission === "granted") {
      new Notification(data.user + " からメッセージ", {
        body: data.text,
        icon: "icon.png"
      });

      notificationSound.currentTime = 0;
      notificationSound.play();
    }

  }

});
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
