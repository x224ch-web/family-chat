import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

export function render(container) {

  container.innerHTML = `
    <div class="login-screen">
      <h2>だれがログインしますか？</h2>

      <div class="profile-row">
        ${profileCard("まよ","👩")}
        ${profileCard("ほのか","👧")}
        ${profileCard("りょう","👦")}
        ${profileCard("しゅん","🧑")}
        ${profileCard("さとし","👨")}
      </div>

      <input id="password" type="password" placeholder="パスワード">
    </div>
  `;

  injectStyles();

  const cards = container.querySelectorAll(".profile-card");

  const emailMap = {
    "まよ": "mayo@family.com",
    "ほのか": "honoka@family.com",
    "りょう": "ryo@family.com",
    "しゅん": "shun@family.com",
    "さとし": "satoshi@family.com"
  };

  cards.forEach(card => {
    card.addEventListener("click", async () => {

      const user = card.dataset.user;
      const password = document.getElementById("password").value;
      const email = emailMap[user];

      if (!password) {
        alert("パスワードを入力してください");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("familyUser", user);
        location.reload();
      } catch (error) {
        alert("ログイン失敗：" + error.message);
      }

    });
  });
}

function profileCard(name, icon) {
  return `
    <div class="profile-card" data-user="${name}">
      <div class="profile-icon">${icon}</div>
      <span>${name}</span>
    </div>
  `;
}

function injectStyles() {

  if (document.getElementById("netflixStyle")) return;

  const style = document.createElement("style");
  style.id = "netflixStyle";

  style.textContent = `
    body {
      margin:0;
      background:#141414;
      color:white;
      font-family:sans-serif;
    }

    .login-screen {
      text-align:center;
      padding:40px 20px;
    }

    h2 {
      margin-bottom:40px;
    }

    .profile-row {
      display:flex;
      gap:20px;
      overflow-x:auto;
      padding:10px;
      scroll-snap-type:x mandatory;
    }

    .profile-card {
      flex:0 0 140px;
      height:220px;
      background:#222;
      border-radius:16px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      cursor:pointer;
      transition:transform 0.2s;
      scroll-snap-align:center;
    }

    .profile-card:hover {
      transform:scale(1.1);
    }

    .profile-icon {
      font-size:60px;
    }

    .profile-card span {
      margin-top:15px;
    }

    input {
      margin-top:40px;
      padding:10px;
      border-radius:8px;
      border:none;
      width:200px;
    }
  `;

  document.head.appendChild(style);
}
