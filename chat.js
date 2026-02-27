import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


export function render(container) {

  const auth = getAuth();
  const db = getFirestore();

  const user = localStorage.getItem("familyUser");

  // 🔐 ログイン確認
  onAuthStateChanged(auth, (firebaseUser) => {
    if (!firebaseUser || !user) {
      window.location.href = "index.html";
    }
  });

  container.innerHTML = `
    <div style="padding:20px;">
      <h2>家族チャット</h2>

      <div id="online" style="font-size:12px;color:green;"></div>

      <div id="messages" style="height:400px;overflow:auto;border:1px solid #ddd;padding:10px;background:#fafafa;"></div>

      <div style="margin-top:10px;">
        <input id="msgInput" placeholder="メッセージ">
        <button id="sendBtn">送信</button>
      </div>
    </div>
  `;

  const messagesDiv = container.querySelector("#messages");
  const sendBtn = container.querySelector("#sendBtn");
  const input = container.querySelector("#msgInput");

  // ⭐ オンライン登録（Firestore）
  setDoc(doc(db, "online", user), {
    name: user,
    updatedAt: serverTimestamp()
  });

  // ⭐ オンライン表示
  onSnapshot(collection(db, "online"), (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data().name);
    container.querySelector("#online").textContent =
      "オンライン: " + users.join(", ");
  });

  // ⭐ メッセージ表示
  const q = query(
    collection(db, "messages"),
    orderBy("createdAt")
  );

  onSnapshot(q, (snapshot) => {
    messagesDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      const msg = document.createElement("div");
      msg.textContent = data.user + "： " + data.text;

      messagesDiv.appendChild(msg);
    });

    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // ⭐ 送信
  sendBtn.addEventListener("click", async () => {

    if (!input.value.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: input.value,
      user: user,
      createdAt: serverTimestamp()
    });

    input.value = "";
  });
}
