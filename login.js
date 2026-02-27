import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export function render(container) {

  const auth = getAuth();

  // 🔥 すでにログイン済みなら自動スキップ
  onAuthStateChanged(auth, (user) => {
    const savedUser = localStorage.getItem("familyUser");

    if (user && savedUser) {
      window.location.href = "chat.html";
    }
  });

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
    </div>
  `;

  injectStyles();

  const cards = container.querySelectorAll(".profile-card");

  cards.forEach(card => {
    card.addEventListener("click", async () => {

      const userName = card.dataset.user;

      try {
        // 🔥 匿名ログイン
        await signInAnonymously(auth);

        // 🔥 家族名を保存
        localStorage.setItem("familyUser", userName);

        // 🔥 チャットへ
        window.location.href = "chat.html";

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
