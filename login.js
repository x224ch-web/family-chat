document.querySelectorAll(".card").forEach(card=>{

  card.addEventListener("click",()=>{

    const user = card.dataset.user;

    // 保存
    localStorage.setItem("currentUser", user);

    // アニメーション開始
    card.classList.add("active");

    // 他のカードをフェードアウト
    document.querySelectorAll(".card").forEach(c=>{
      if(c !== card){
        c.classList.add("fade-out");
      }
    });

    // 少し待ってから画面切替
    setTimeout(()=>{

      document.getElementById("login-view").style.display="none";
      document.getElementById("chat-view").style.display="flex";

      document.getElementById("username").innerText = user;

    },300);

  });

});


