document.addEventListener("DOMContentLoaded",()=>{

const cards=document.querySelectorAll(".card");

const db=firebase.database();

cards.forEach(card=>{

const user=card.dataset.name;

const badge=card.querySelector(".unread");

/* unread */

db.ref("messages").on("value",snap=>{

let count=0;

snap.forEach(m=>{

if(m.val().user!==user) count++;

});

badge.style.display=count?"block":"none";

badge.innerText=count;

});

/* login */

card.onclick=()=>{

localStorage.setItem("currentUser",user);

location.reload();

};

});

/* memo */

document.querySelectorAll(".card-memo").forEach(memo=>{

const user=memo.closest(".card").dataset.name;

const saved=localStorage.getItem("memo_"+user);

if(saved){

memo.innerText=saved;

memo.classList.remove("empty");

}

memo.oninput=()=>{

localStorage.setItem("memo_"+user,memo.innerText);

};

});

});
