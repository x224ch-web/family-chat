document.querySelectorAll(".card").forEach(card=>{

card.onclick=()=>{

const user=card.dataset.user;

localStorage.setItem("currentUser",user);

location.reload();

};

});


/* ===============================
   unread badge
=============================== */

const users=["mayo","honoka","ryo","shun","satoshi"];

const db=firebase.database().ref("messages");

db.on("value",snap=>{

const data=snap.val();

if(!data)return;

let unread={};

users.forEach(u=>unread[u]=0);

Object.values(data).forEach(msg=>{

users.forEach(u=>{

if(msg.user!==u){

if(!msg.reads || !msg.reads[u]){

unread[u]++;

}

}

});

});


users.forEach(u=>{

const badge=document.getElementById("badge-"+u);

if(!badge)return;

if(unread[u]>0){

badge.style.display="block";

badge.innerText=unread[u];

}else{

badge.style.display="none";

}

});

});
