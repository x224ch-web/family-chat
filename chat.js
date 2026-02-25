import { getDatabase, ref, push, onValue, update }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { getStorage, ref as sRef, uploadBytes, getDownloadURL }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

export function render(container) {

  container.innerHTML = `
    <div style="padding:20px;">
      <h2>家族チャット</h2>

      <div id="online" style="font-size:12px;color:green;"></div>

      <div id="messages" style="height:400px;overflow:auto;border:1px solid #ddd;padding:10px;background:#fafafa;"></div>

      <div style="margin-top:10px;">
        <input id="msgInput" placeholder="メッセージ">
        <input type="file" id="imgInput">
        <button id="sendBtn">送信</button>
      </div>
    </div>
  `;

  const db = getDatabase();
  const chatRef = ref(db, "chat");
  const onlineRef = ref(db, "online");

  const storage = getStorage();

  const user = localStorage.getItem("familyUser");
  const messages = container.querySelector("#messages");

  // ⭐ オンライン登録
  update(ref(db, "online/" + user), { online: true });

  onValue(onlineRef, snap => {
    const users = [];
    snap.forEach(c => {
      if (c.val().online) users.push(c.key);
    });
    container.querySelector("#online").textContent = "オンライン: " + users.join(", ");
  });

  container.querySelector("#sendBtn").onclick = async () => {

    const text = container.querySelector("#msgInput").value;
    const file = container.querySelector("#imgInput").files[0];

    let imageUrl = null;

    if (file) {
      const fileRef = sRef(storage, "images/" + Date.now());
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
    }

    push(chatRef, {
      user,
      text,
      imageUrl,
      time: Date.now(),
      reads: { [user]: true }
    });

    container.querySelector("#msgInput").value = "";
    container.querySelector("#imgInput").value = "";
  };

  onValue(chatRef, snap => {

    messages.innerHTML = "";

    snap.forEach(child => {

      const data = child.val();
      const key = child.key;

      // ⭐ 既読登録
      update(ref(db, "chat/" + key + "/reads/" + user), true);

      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.margin = "6px 0";
      wrap.style.justifyContent = data.user === user ? "flex-end" : "flex-start";

      const bubble = document.createElement("div");
      bubble.style.padding = "10px";
      bubble.style.borderRadius = "18px";
      bubble.style.maxWidth = "70%";
      bubble.style.background = data.user === user ? "#DCF8C6" : "#fff";
      bubble.style.border = "1px solid #ddd";

      const time = new Date(data.time).toLocaleTimeString();

      bubble.innerHTML = `
        <div style="font-size:12px;color:#555;">${data.user}</div>
        <div>${data.text || ""}</div>
        ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width:200px;">` : ""}
        <div style="font-size:10px;color:#999;">${time}</div>
        <div style="font-size:10px;color:#0a0;">既読 ${data.reads ? Object.keys(data.reads).length : 0}</div>
      `;

      wrap.appendChild(bubble);
      messages.appendChild(wrap);

    });

    messages.scrollTop = messages.scrollHeight;

  });

}
