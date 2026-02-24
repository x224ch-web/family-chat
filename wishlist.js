import { getDatabase, ref, push, onValue, remove }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

export function render(container) {

  container.innerHTML = `
    <div style="padding:16px;">
      <h3>欲しいものリスト</h3>

      <input id="wishInput" placeholder="欲しいものを書く">
      <button id="addWish">追加</button>

      <ul id="wishList"></ul>
    </div>
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
        <button style="margin-left:10px;">削除</button>
      `;

      li.querySelector("button").onclick = () => {
        remove(ref(db, "wishlist/" + id));
      };

      list.appendChild(li);
    });

  });

}
