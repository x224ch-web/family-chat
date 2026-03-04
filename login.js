document.addEventListener("DOMContentLoaded", function(){

document.querySelectorAll(".card-memo").forEach(memo=>{

const card = memo.closest(".card");
const user = card.dataset.name;

const saved = localStorage.getItem("memo_"+user);

if(saved){
memo.innerText=saved;
memo.classList.remove("empty");
}else{
memo.innerText=memo.dataset.placeholder;
memo.classList.add("empty");
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

document.querySelectorAll(".card").forEach(card=>{

card.addEventListener("click",(e)=>{

if(e.target.closest(".card-memo")) return;

const user=card.dataset.name;

localStorage.setItem("currentUser",user);

document.getElementById("login-view").style.display="none";
document.getElementById("chat-view").style.display="block";

document.getElementById("chat-username").innerText=user;

});

});

const logout=document.getElementById("logoutBtn");

if(logout){

logout.onclick=function(){

localStorage.removeItem("currentUser");

document.getElementById("chat-view").style.display="none";
document.getElementById("login-view").style.display="block";

};

}

const savedUser=localStorage.getItem("currentUser");

if(savedUser){

document.getElementById("login-view").style.display="none";
document.getElementById("chat-view").style.display="block";

document.getElementById("chat-username").innerText=savedUser;

}

});
