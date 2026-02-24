import { getDatabase, ref, push, onValue, remove, off }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { registerListener } from "./listenerManager.js";

export function render(container) {

  container.innerHTML = `
    <h3>欲しいものリスト</h3>
    <input id="wishInput">
    <button id="addWish">追加</button>
    <ul id="wishList"></ul>
  `;

  const db = getDatabase();
  const wishRef = ref(db, "wishlist");

  const input = container.querySelector("#wishInput");
  const list = container.querySelector("#wishList");

  container.querySelector("#addWish").onclick = () => {
    if (!input.value.trim()) return;

    push(wishRef, {
      text: input.value,
      createdAt: Date.now()
    });

    input.value = "";
  };

  onValue(wishRef, snapshot => {

    list.innerHTML = "";

    snapshot.forEach(child => {

      const data = child.val();
      const id = child.key;

      const li = document.createElement("li");

      li.innerHTML = `
        ${data.text}
        <button>削除</button>
      `;

      li.querySelector("button").onclick = () => {
        remove(ref(db, "wishlist/" + id));
      };

      list.appendChild(li);
    });

  });

  // ⭐ listener登録
  registerListener(() => off(wishRef));
}
