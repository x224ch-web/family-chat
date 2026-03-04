document.addEventListener("DOMContentLoaded", function(){

// ===== メモ管理 =====
document.querySelectorAll(".card-memo").forEach(memo=>{
  const card = memo.closest(".card");
  if(!card) return;

  const user = card.dataset.user;
  const saved = localStorage.getItem("memo_"+user);

  if(saved){
    memo.innerText=saved;
    memo.classList.remove("empty");
  }else{
    memo.innerText=memo.dataset.placeholder;
  }

  memo.addEventListener("focus",()=>{
    if(memo.classList.contains("empty")){
      memo.innerText="";
      memo.classList.remove("empty");
    }
  });

  memo.addEventListener("blur",()=>{
    const text=memo.innerText.trim();
    if(text===""){
      memo.innerText=memo.dataset.placeholder;
      memo.classList.add("empty");
      localStorage.removeItem("memo_"+user);
    }else{
      localStorage.setItem("memo_"+user,text);
    }
  });
});


// ===== ログイン処理 =====
document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("click",(e)=>{

    if(e.target.closest(".card-memo")) return;

    const user=card.dataset.user;
    localStorage.setItem("currentUser",user);

    const title = document.querySelector(".login-title");
    const container = document.querySelector(".card-container");
    const chat = document.getElementById("chat-view");
    const name = document.getElementById("chat-username");

    if(title) title.style.display="none";
    if(container) container.style.display="none";
    if(chat) chat.style.display="block";
    if(name) name.innerText=user;

  });
});


// ===== ログアウト =====
function attachLogoutEvent(){

  const btn=document.getElementById("logoutBtn");
  if(!btn) return;

  btn.onclick=function(){

    localStorage.removeItem("currentUser");

    const title = document.querySelector(".login-title");
    const container = document.querySelector(".card-container");
    const chat = document.getElementById("chat-view");

    if(chat) chat.style.display="none";
    if(title) title.style.display="block";
    if(container) container.style.display="flex";

  };
}

attachLogoutEvent();


// ===== 再読み込み対応 =====
const savedUser=localStorage.getItem("currentUser");

if(savedUser){

  const title = document.querySelector(".login-title");
  const container = document.querySelector(".card-container");
  const chat = document.getElementById("chat-view");
  const name = document.getElementById("chat-username");

  if(title) title.style.display="none";
  if(container) container.style.display="none";
  if(chat) chat.style.display="block";
  if(name) name.innerText=savedUser;

}

});
