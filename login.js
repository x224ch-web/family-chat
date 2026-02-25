const SECRET_CODE = "1234";

export function render(container) {

  container.innerHTML = `
    <div style="padding:20px;">
      <h3>家族チャットにログイン</h3>

      <input id="familyCode" type="password" placeholder="パスコード"><br><br>

      <p>あなたは誰？</p>

      <div class="profile-slider" id="profileSlider">

        <div class="profile-card" data-user="まよ">👩<br>まよ</div>
        <div class="profile-card" data-user="ほのか">👧<br>ほのか</div>
        <div class="profile-card" data-user="りょう">👦<br>りょう</div>
        <div class="profile-card" data-user="しゅん">🧑<br>しゅん</div>
        <div class="profile-card" data-user="さとし">👨<br>さとし</div>

      </div>
    </div>
  `;

  injectStyles();

  const slider = container.querySelector("#profileSlider");
  const cards = container.querySelectorAll(".profile-card");

  function updateScale() {
    const center = slider.offsetWidth / 2;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(center - cardCenter);

      const scale = Math.max(1.2 - distance / 400, 0.8);
      card.style.transform = `scale(${scale})`;
    });
  }

  slider.addEventListener("scroll", updateScale);
  updateScale();

  cards.forEach(card => {

    card.onclick = () => {

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

  if (document.getElementById("loginCardStyles")) return;

  const style = document.createElement("style");
  style.id = "loginCardStyles";

  style.textContent = `
    .profile-slider {
      display:flex;
      overflow-x:auto;
      gap:20px;
      padding:20px 0;
      scroll-snap-type:x mandatory;
    }

    .profile-card {
      min-width:120px;
      height:140px;
      background:white;
      border-radius:20px;
      box-shadow:0 4px 10px rgba(0,0,0,0.15);
      text-align:center;
      padding:20px;
      scroll-snap-align:center;
      transition:transform 0.25s;
      cursor:pointer;
      font-size:20px;
    }
  `;

  document.head.appendChild(style);
}
