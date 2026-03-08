document.addEventListener("DOMContentLoaded",()=>{

const user=localStorage.getItem("currentUser");

if(!user)return;

document.getElementById("login-view").style.display="none";

document.getElementById("chat-view").style.display="flex";

document.getElementById("username").innerText=user;

const db=firebase.database().ref("messages");

const messages=document.querySelector(".messages");

const input=document.querySelector("input");

const btn=document.querySelector("button");

const sound=new Audio("639hz.mp3");

/* send */

btn.onclick=send;

input.onkeypress=e=>{

if(e.key==="Enter")send();

};

function send(){

const text=input.value.trim();

if(!text)return;

db.push({

user:user,
text:text,
time:Date.now()

});

input.value="";

}

/* receive */

db.on("child_added",snap=>{

const m=snap.val();

const div=document.createElement("div");

div.className="message "+(m.user===user?"right":"left");

let html="";

if(m.user!==user){

html+=`<div class="name">${m.user}</div>`;

sound.play().catch(()=>{});

}

html+=`<div class="bubble">${m.text}</div>`;

div.innerHTML=html;

messages.appendChild(div);

messages.scrollTop=messages.scrollHeight;

});

/* logout */

document.getElementById("logout").onclick=()=>{

localStorage.removeItem("currentUser");

location.reload();

};

});
