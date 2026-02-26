import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function render(container) {

  // ✅ initializeApp() が終わった後に呼ばれる
  const auth = getAuth();

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

        // ログイン成功
        localStorage.setItem("familyUser", user);

        // 🔥 とりあえず再読み込み（後でチャット画面へ遷移可能）
        location.reload();

      } catch (error) {
        alert("ログイン失敗：\n" + error.message);
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
      font-weight:500;
    }

    .profile-row {
      display:flex;
      gap:20px;
      overflow-x:auto;
      padding:20px;
      scroll-snap-type:x mandatory;
    }

    .profile-card {
      flex:0 0 150px;
      height:240px;
      background:#222;
      border-radius:16px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      cursor:pointer;
      transition:transform 0.2s ease;
      scroll-snap-align:center;
    }

    .profile-card:hover {
      transform:scale(1.08);
    }

    .profile-icon {
      font-size:70px;
    }

    .profile-card span {
      margin-top:15px;
      font-size:16px;
    }

    input {
      margin-top:40px;
      padding:12px;
      border-radius:8px;
      border:none;
      width:220px;
      font-size:16px;
    }
  `;

  document.head.appendChild(style);
}
