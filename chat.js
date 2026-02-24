import { clearListeners } from "./listenerManager.js";

export function render(container) {

  container.innerHTML = `
    <div id="view" style="height:calc(100% - 60px); overflow:auto;"></div>

    <nav class="tabbar">
      <button data-tab="chat">💬</button>
      <button data-tab="calendar">📅</button>
      <button data-tab="tasks">✔</button>
      <button data-tab="wishlist">🛒</button>
    </nav>
  `;

  // ⭐ ログアウトボタン
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "ログアウト";

  logoutBtn.style.position = "absolute";
  logoutBtn.style.top = "10px";
  logoutBtn.style.right = "10px";

  logoutBtn.onclick = () => {
    localStorage.removeItem("familyUser");
    location.reload();
  };

  container.prepend(logoutBtn);

  initTabs(container);
}

function initTabs(container) {

  const view = container.querySelector("#view");
  const buttons = container.querySelectorAll(".tabbar button");

  buttons.forEach(btn => {
    btn.onclick = () => {

      // ⭐ listener全解除
      clearListeners();

      // ⭐ ハイライト
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      loadTab(btn.dataset.tab, view);
    };
  });

  loadTab("chat", view);
}

function loadTab(name, view) {

  view.innerHTML = "読み込み中...";

  import(`./${name}.js`)
    .then(mod => {
      try {
        mod.render(view);
      } catch (e) {
        console.error("render error:", e);
        view.innerHTML = "描画エラー";
      }
    })
    .catch(err => {
      console.error("タブ読み込みエラー:", err);
      view.innerHTML = "<p>読み込みエラー</p>";
    });
}
