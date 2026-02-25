const SECRET_CODE = "1234";

export function render(container) {

  container.innerHTML = `
    <div style="padding:20px;">
      <h3>家族チャットにログイン</h3>

      <input id="familyCode" type="password" placeholder="パスコード"><br><br>

      <div class="profile-slider" id="profileSlider">

        <div class="spacer"></div>

        ${card("まよ","👩")}
        ${card("ほのか","👧")}
        ${card("りょう","👦")}
        ${card("しゅん","🧑")}
        ${card("さとし","👨")}

        <div class="spacer"></div>

      </div>
    </div>
  `;

  injectStyles();

  const slider = container.querySelector("#profileSlider");
  const cards = container.querySelectorAll(".profile-card");

  let activeCard = null;
  let snapping = false;
  let scrollTimeout;

  // ⭐ アニメーション
  function animate() {

    const rect = slider.getBoundingClientRect();
    const center = rect.left + rect.width / 2;

    let maxScale = 0;

    cards.forEach(card => {

      const r = card.getBoundingClientRect();
      const cardCenter = r.left + r.width / 2;

      const distance = Math.abs(center - cardCenter);

      let scale = 1.8 - (distance / 250);
      scale = Math.max(scale, 0.5);

      let rotate = (center - cardCenter) / 20;

      card.style.transform =
        `translateZ(0) scale(${scale}) rotateY(${rotate}deg)`;

      card.style.zIndex = Math.round(scale * 100);

      if (scale > maxScale) {
        maxScale = scale;
        activeCard = card;
      }

    });

    cards.forEach(card => {
      card.classList.toggle("active", card === activeCard);
    });

    requestAnimationFrame(animate);
  }

  animate();

  // ⭐ 完全安定スナップ
  slider.addEventListener("scroll", () => {

    if (snapping) return;

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      snapToNearest();
    }, 140);

  });

  function snapToNearest() {

    snapping = true;

    const sliderRect = slider.getBoundingClientRect();
    const center = sliderRect.left + sliderRect.width / 2;

    let nearest = null;
    let minDistance = Infinity;

    cards.forEach(card => {

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;

      const distance = Math.abs(center - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = card;
      }

    });

    if (!nearest) {
      snapping = false;
      return;
    }

    const rect = nearest.getBoundingClientRect();

    const offset =
      (rect.left + rect.width / 2) -
      center;

    slider.scrollBy({
      left: offset,
      behavior: "auto"
    });

    // ⭐ ポップ演出
    nearest.style.transition = "transform 0.2s";
    nearest.style.transform += " scale(1.05)";

    setTimeout(() => {
      nearest.style.transition = "";
    }, 200);

    // ⭐ 振動
    navigator.vibrate?.(8);

    setTimeout(() => {
      snapping = false;
    }, 80);

  }

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

      localStorage.setItem("familyUser", user);

      import("./chat.js").then(mod => {
        mod.render(container);
      });

    };

  });

}

function card(name, icon) {
  return `
    <div class="profile-card" data-user="${name}">
      <div class="avatar">${icon}</div>
      <p>${name}</p>
    </div>
  `;
}

function injectStyles() {

  if (document.getElementById("netflixLoginStyles")) return;

  const style = document.createElement("style");
  style.id = "netflixLoginStyles";

  style.textContent = `
    .profile-slider {
      display:flex;
      overflow-x:auto;
      padding:60px 40px;
      -webkit-overflow-scrolling:touch;
      perspective:1000px;
      touch-action:pan-x;
    }

    .spacer {
      min-width:40vw;
      flex-shrink:0;
    }

    .profile-card {
      min-width:160px;
      height:200px;
      margin-left:-32px;
      background:linear-gradient(180deg,#fff,#f3f3f3);
      border-radius:22px;
      box-shadow:0 20px 40px rgba(0,0,0,0.25);
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      transform:translateZ(0);
      will-change:transform;
      cursor:pointer;
      transition:box-shadow 0.2s ease;
    }

    .profile-card.active {
      box-shadow:
        0 30px 70px rgba(0,0,0,0.35),
        0 0 30px rgba(255,255,255,0.6);
    }

    .avatar {
      font-size:50px;
      margin-bottom:10px;
    }
  `;

  document.head.appendChild(style);
}
