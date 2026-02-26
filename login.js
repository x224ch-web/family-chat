const SECRET_CODE = "1234";

export function render(container) {

  container.innerHTML = `
    <div class="login-wrapper">
      <h3>家族チャットにログイン</h3>
      <input id="familyCode" type="password" placeholder="パスコード"><br><br>

      <div class="dock" id="dock">
        ${card("まよ","👩")}
        ${card("ほのか","👧")}
        ${card("りょう","👦")}
        ${card("しゅん","🧑")}
        ${card("さとし","👨")}
      </div>
    </div>
  `;

  injectStyles();

  const dock = container.querySelector("#dock");
  const cards = container.querySelectorAll(".dock-item");

  let activeCard = null;

  // ⭐ Dockマグニファイ（マウス）
  dock.addEventListener("mousemove", e => {

    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX;

    cards.forEach(card => {

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;

      const distance = Math.abs(mouseX - cardCenter);

      // ガウス減衰
      const scale = 1 + Math.exp(-(distance ** 2) / 20000) * 1.2;

      card.style.transform = `scale(${scale})`;

      if (scale > 1.9) {
        activeCard = card;
      }

    });

  });

  // ⭐ マウス離れたら戻す
  dock.addEventListener("mouseleave", () => {
    cards.forEach(card => {
      card.style.transform = "scale(1)";
    });
    activeCard = null;
  });

  // ⭐ タッチ対応（中央拡大）
  dock.addEventListener("touchmove", e => {

    const touchX = e.touches[0].clientX;

    cards.forEach(card => {

      const rect = card.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = Math.abs(touchX - center);

      const scale = 1 + Math.exp(-(distance ** 2) / 20000) * 1.2;

      card.style.transform = `scale(${scale})`;

      if (scale > 1.9) {
        activeCard = card;
      }

    });

  });

  // ⭐ クリック
  cards.forEach(card => {

    card.onclick = () => {

      if (card !== activeCard) return;

      const code = container.querySelector("#familyCode").value;

      if (code !== SECRET_CODE) {
        alert("パスコード違います");
        return;
      }

      const user = card.dataset.user;

      playLoginAnimation(card, user);

    };

  });

}

function card(name, icon) {
  return `
    <div class="dock-item" data-user="${name}">
      <div class="avatar">${icon}</div>
      <span>${name}</span>
    </div>
  `;
}

function injectStyles() {

  if (document.getElementById("dockStyles")) return;

  const style = document.createElement("style");
  style.id = "dockStyles";

  style.textContent = `
    body {
      margin:0;
      background:linear-gradient(180deg,#f5f5f7,#e8e8ec);
      font-family:sans-serif;
    }

    .login-wrapper {
      text-align:center;
      padding-top:40px;
    }

    .dock {
      margin-top:40px;
      display:flex;
      justify-content:center;
      align-items:flex-end;
      gap:20px;
      height:180px;
    }

    .dock-item {
      width:120px;
      height:120px;
      background:white;
      border-radius:24px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      box-shadow:0 15px 30px rgba(0,0,0,0.2);
      transition:transform 0.1s ease-out;
      cursor:pointer;
    }

    .avatar {
      font-size:40px;
    }

    .dock-item span {
      margin-top:8px;
      font-size:14px;
    }
  `;

  document.head.appendChild(style);
}
