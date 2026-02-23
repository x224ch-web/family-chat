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

  document.querySelectorAll(".tabbar button").forEach(btn => {
    btn.onclick = () => loadTab(btn.dataset.tab, view);
  });

  // 最初はチャット
  loadTab("chat", view);
}

function loadTab(name, view) {

  import(`./${name}.js`)
    .then(mod => mod.render(view));
}
