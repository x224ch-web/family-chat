export function render(container) {

  container.innerHTML = `
    <div id="view" style="padding:20px;">
      <h2>チャット画面</h2>
    </div>

    <nav class="tabbar">
      <button data-tab="chat">💬</button>
      <button data-tab="calendar">📅</button>
      <button data-tab="tasks">✔</button>
      <button data-tab="wishlist">🛒</button>
    </nav>
  `;

  const view = container.querySelector("#view");
  const buttons = container.querySelectorAll(".tabbar button");

  buttons.forEach(btn => {
    btn.onclick = () => {
      view.innerHTML = `<h2>${btn.dataset.tab} タブ</h2>`;
    };
  });

}
