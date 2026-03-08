document.addEventListener("DOMContentLoaded", function () {

const input = document.querySelector(".input-area input");
const sendBtn = document.querySelector(".input-area button");
const messages = document.querySelector(".messages");

if (!input || !sendBtn || !messages) return;

const currentUser = localStorage.getItem("currentUser") || "unknown";

const chatRef = firebase.database().ref("messages");

const notificationSound = new Audio("639hz.mp3");


/* ===============================
   Time format
=============================== */

function formatTime(ts){

const d = new Date(ts);

const h = d.getHours().toString().padStart(2,'0');
const m = d.getMinutes().toString().padStart(2,'0');

return h + ":" + m;

}


/* ===============================
   Auto scroll
=============================== */

function scrollToBottom(){

messages.scrollTop = messages.scrollHeight;

}


/* ===============================
   Send message
=============================== */

function sendMessage(){

const text = input.value.trim();

if(text === "") return;

chatRef.push({

user: currentUser,
text: text,
time: Date.now()

});

input.value="";

}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function(e){

if(e.key==="Enter"){
sendMessage();
}

});


/* ===============================
   Receive messages
=============================== */

chatRef.on("child_added", function(snapshot){

const msg = snapshot.val();

const messageDiv = document.createElement("div");

if(msg.user === currentUser){

messageDiv.className = "message right";

}else{

messageDiv.className = "message left";

}


/* ===============================
   Build HTML
=============================== */

let html = "";

if(msg.user !== currentUser){

html += `<div class="name">${msg.user}</div>`;

}

html += `<div class="bubble">${msg.text}</div>`;

html += `<div class="meta">${formatTime(msg.time)}</div>`;

messageDiv.innerHTML = html;

messages.appendChild(messageDiv);


/* ===============================
   Notification
=============================== */

if(msg.user !== currentUser){

notificationSound.currentTime = 0;
notificationSound.play();

}


/* ===============================
   Auto scroll
=============================== */

scrollToBottom();

});

});
