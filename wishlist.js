// wishlist.js

export function render(container) {

  // ① 画面の中身を作る
  container.innerHTML = `
    <h3>欲しいものリスト</h3>

    <input id="wishInput" placeholder="欲しいものを書く">
    <button id="addWish">追加</button>

    <ul id="wishList"></ul>
  `;

  // ② ボタン動作を設定
  initWishlist();
}

function initWishlist() {
  const input = document.getElementById("wishInput");
  const btn = document.getElementById("addWish");
  const list = document.getElementById("wishList");

  btn.onclick = () => {
    if (!input.value.trim()) return;

    const li = document.createElement("li");
    li.textContent = input.value;

    list.appendChild(li);
    input.value = "";
  };
}
