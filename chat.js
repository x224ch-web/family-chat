document.addEventListener("DOMContentLoaded", () => {

const user = localStorage.getItem("currentUser");

const loginView = document.getElementById("login-view");
const chatView = document.getElementById("chat-view");

const usernameLabel = document.getElementById("username");

const messages = document.querySelector(".messages");
const input = document.querySelector(".input-area input");
const sendBtn = document.querySelector(".input-area button");

const logoutBtn = document.getElementById("logout");

const users = ["mayo","honoka","ryo","shun","satoshi"];


/* ===============================
Login
=============================== */

if(!user){

loginView.style.display="flex";
chatView.style.display="none";
return;

}

loginView.style.display="none";
chatView.style.display="flex";

usernameLabel.innerText = user;


/* ===============================
Firebase
=============================== */

const db = firebase.database().ref("messages");


/* ===============================
通知
=============================== */

if ("Notification" in window) {
Notification.requestPermission().catch(()=>{});
}

const sound = new Audio("639hz.mp3");

let initialLoad = true;


/* ===============================
Send
=============================== */

function sendMessage(){

const text = input.value.trim();

if(!text) return;

let reads = {};

users.forEach(u=>{

reads[u] = (u === user);

});

db.push({

user:user,
text:text,
time:Date.now(),
reads:reads

});

input.value="";

}

sendBtn.onclick = sendMessage;

input.addEventListener("keypress", e=>{

if(e.key==="Enter") sendMessage();

});


/* ===============================
Render
=============================== */

function renderMessage(msg,id){

if(!msg) return;

const div = document.createElement("div");

div.className = "message " + (msg.user === user ? "right":"left");


let html="";


/* 名前 */

if(msg.user !== user){

html += `<div class="name">${msg.user}</div>`;

}


/* 吹き出し */

html += `<div class="bubble">${msg.text}</div>`;


/* 時間 */

const d = new Date(msg.time);

const time = d.getHours()+":"+String(d.getMinutes()).padStart(2,"0");

html += `<div class="meta">${time}</div>`;


/* 既読 */

if(msg.user === user){

let readCount = 0;

for(let u in msg.reads){

if(msg.reads[u]) readCount++;

}

html += `<div class="read">既読 ${readCount}</div>`;

}

div.innerHTML = html;

messages.appendChild(div);

scrollBottom();

}


/* ===============================
既読更新
=============================== */

function markAsRead(id,msg){

if(!msg.reads) return;

if(msg.reads[user]) return;

firebase.database()
.ref("messages/"+id+"/reads/"+user)
.set(true);

}


/* ===============================
通知
=============================== */

function notify(msg){

if(Notification.permission==="granted"){

new Notification("Family Chat",{

body:msg.user+" : "+msg.text,
icon:"images/icon.png"

});

}

sound.play().catch(()=>{});

}


/* ===============================
Receive
=============================== */

db.on("child_added", snap=>{

const msg = snap.val();

const id = snap.key;

renderMessage(msg,id);

markAsRead(id,msg);

if(initialLoad) return;

if(msg.user === user) return;

notify(msg);

});


setTimeout(()=>{

initialLoad=false;

},1500);


/* ===============================
Scroll
=============================== */

function scrollBottom(){

setTimeout(()=>{

messages.scrollTop = messages.scrollHeight;

},50);

}


/* ===============================
Logout
=============================== */

logoutBtn.onclick=()=>{

localStorage.removeItem("currentUser");

location.reload();

};

});
