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

  initTabs(container);
}

function initTabs(container) {

  const view = container.querySelector("#view");
  const buttons = container.querySelectorAll(".tabbar button");

  buttons.forEach(btn => {
    btn.onclick = () => {

      // ハイライト
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
    .then(mod => mod.render(view))
    .catch(err => {
      console.error("タブ読み込みエラー:", err);
      view.innerHTML = "<p>読み込みエラー</p>";
    });
registerListener(() => off(ref));
}
