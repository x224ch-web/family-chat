document.addEventListener("DOMContentLoaded", function(){

const users = [
  {name:"mayo", img:"images/mayo.jpg"},
  {name:"honoka", img:"images/honoka.jpg"},
  {name:"ryo", img:"images/ryo.jpg"},
  {name:"shun", img:"images/shun.jpg"},
  {name:"satoshi", img:"images/satoshi.jpg"}
];

const container = document.querySelector(".card-container");

if(!container) return;

container.innerHTML="";

users.forEach(user => {

const card = document.createElement("div");
card.className="card";

card.innerHTML = `
<img src="${user.img}">
<div class="card-name">${user.name}</div>
<div class="card-memo" contenteditable="true"></div>
`;

const memo = card.querySelector(".card-memo");

const saved = localStorage.getItem("memo_"+user.name);

if(saved){
memo.innerText = saved;
}

memo.addEventListener("input",()=>{
localStorage.setItem("memo_"+user.name,memo.innerText);
});

card.addEventListener("click",()=>{

localStorage.setItem("currentUser",user.name);

document.querySelector("#login-view").style.display="none";
document.querySelector("#chat-view").style.display="flex";

location.reload();

});

container.appendChild(card);

});

});
