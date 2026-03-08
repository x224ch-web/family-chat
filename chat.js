document.addEventListener("DOMContentLoaded", () => {

const user = localStorage.getItem("currentUser");

const loginView = document.getElementById("login-view");
const chatView = document.getElementById("chat-view");

const usernameLabel = document.getElementById("username");

const messages = document.querySelector(".messages");
const input = document.querySelector(".input-area input");
const sendBtn = document.querySelector(".input-area button");

const logoutBtn = document.getElementById("logout");

/* ===============================
   Login check
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
   Notification sound
=============================== */

const sound = new Audio("639hz.mp3");


/* ===============================
   Send message
=============================== */

function sendMessage(){

const text = input.value.trim();

if(!text) return;

db.push({

user:user,
text:text,
time:Date.now()

});

input.value="";

}

sendBtn.onclick = sendMessage;

input.addEventListener("keypress", e => {

if(e.key === "Enter"){

sendMessage();

}

});


/* ===============================
   Render message
=============================== */

function renderMessage(msg){

if(!msg) return;
if(!msg.user) return;
if(!msg.text) return;

const div = document.createElement("div");

div.className = "message " + (msg.user === user ? "right" : "left");

let html = "";

if(msg.user !== user){

html += `<div class="name">${msg.user}</div>`;

sound.play().catch(()=>{});

}

html += `<div class="bubble">${msg.text}</div>`;

div.innerHTML = html;

messages.appendChild(div);

scrollBottom();

}


/* ===============================
   Receive messages
=============================== */

db.on("child_added", snap => {

const msg = snap.val();

renderMessage(msg);

});


/* ===============================
   Auto scroll
=============================== */

function scrollBottom(){

setTimeout(()=>{

messages.scrollTop = messages.scrollHeight;

},50);

}


/* ===============================
   Logout
=============================== */

logoutBtn.onclick = () => {

localStorage.removeItem("currentUser");

location.reload();

};

});
