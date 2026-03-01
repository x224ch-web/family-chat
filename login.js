// ===== メモ初期化 =====
document.querySelectorAll(".card-memo").forEach(memo => {

  const user = memo.closest(".card").dataset.user;
  const saved = localStorage.getItem("memo_" + user);

  if (saved) {
    memo.innerText = saved;
    memo.classList.remove("empty");
  } else {
    memo.innerText = memo.dataset.placeholder;
  }

  memo.addEventListener("focus", () => {
    if (memo.classList.contains("empty")) {
      memo.innerText = "";
      memo.classList.remove("empty");
    }
  });

  memo.addEventListener("blur", () => {
    const text = memo.innerText.trim();
    if (text === "") {
      memo.innerText = memo.dataset.placeholder;
      memo.classList.add("empty");
      localStorage.removeItem("memo_" + user);
    } else {
      localStorage.setItem("memo_" + user, text);
    }
  });

});


// ===== ログイン処理 =====
document.querySelectorAll(".card").forEach(card => {

  card.addEventListener("click", (e) => {

    // メモを押したらログインしない
    if (e.target.closest(".card-memo")) return;

    const user = card.dataset.user;
    localStorage.setItem("currentUser", user);
    showChat(user);
  });

});

function showChat(user) {

  document.querySelector(".login-title").style.display = "none";
  document.querySelector(".card-container").style.display = "none";

  document.getElementById("chat-view").style.display = "block";
  document.getElementById("chat-username").innerText = user;
}


// ===== ログアウト =====
document.getElementById("logoutBtn").addEventListener("click", () => {

  localStorage.removeItem("currentUser");

  document.getElementById("chat-view").style.display = "none";
  document.querySelector(".login-title").style.display = "block";
  document.querySelector(".card-container").style.display = "flex";
});


// ===== 再読み込み対応 =====
const savedUser = localStorage.getItem("currentUser");
if (savedUser) {
  showChat(savedUser);
}
