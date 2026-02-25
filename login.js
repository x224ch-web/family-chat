const SECRET_CODE = "1234";

export function render(container) {

  container.innerHTML = `
    <div style="padding:20px;">
      <h3>家族チャットにログイン</h3>

      <input id="familyCode" type="password" placeholder="パスコード"><br><br>

      <div class="profile-slider" id="profileSlider">

        <div class="profile-card" data-user="まよ">
          <div class="avatar">👩</div>
          <p>まよ</p>
        </div>

        <div class="profile-card" data-user="ほのか">
          <div class="avatar">👧</div>
          <p>ほのか</p>
        </div>

        <div class="profile-card" data-user="りょう">
          <div class="avatar">👦</div>
          <p>りょう</p>
        </div>

        <div class="profile-card" data-user="しゅん">
          <div class="avatar">🧑</div>
          <p>しゅん</p>
        </div>

        <div class="profile-card" data-user="さとし">
          <div class="avatar">👨</div>
          <p>さとし</p>
        </div>

      </div>
    </div>
  `;

  injectStyles();

  const slider = container.querySelector("#profileSlider");
  const cards = container.querySelectorAll(".profile-card");

  let activeCard = null;

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

  cards.forEach(card => {

    card.onclick = () => {

      if (card !== activeCard) {
        // 中央以外は無効
        return;
      }

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

function injectStyles() {

  if (document.getElementById("netflixLoginStyles")) return;

  const style = document.createElement("style");
  style.id = "netflixLoginStyles";

  style.textContent = `
    .profile-slider {
      display:flex;
      overflow-x:auto;
      padding:60px 40px;
      scroll-snap-type:x mandatory;
      -webkit-overflow-scrolling:touch;
      perspective:1000px;
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
      scroll-snap-align:center;
      transform:translateZ(0);
      will-change:transform;
      cursor:pointer;
      transition:box-shadow 0.2s ease;
    }

    .profile-card:first-child {
      margin-left:0;
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
