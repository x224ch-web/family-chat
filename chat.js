document.addEventListener("DOMContentLoaded", function(){

const database = firebase.database();

const currentUser = localStorage.getItem("currentUser");

if(!currentUser) return;

const input=document.querySelector(".input-area input");
const sendBtn=document.getElementById("sendBtn");
const messages=document.querySelector(".messages");

const chatRef=database.ref("messages");

sendBtn.onclick=sendMessage;

input.addEventListener("keypress",(e)=>{
if(e.key==="Enter") sendMessage();
});

function sendMessage(){

const text=input.value.trim();

if(text==="") return;

chatRef.push({

user:currentUser,
text:text,
time:Date.now()

});

input.value="";

}

chatRef.on("child_added",(snapshot)=>{

const msg=snapshot.val();

const row=document.createElement("div");

row.classList.add("message-row");

if(msg.user===currentUser){
row.classList.add("me");
}else{
row.classList.add("other");
}

const bubble=document.createElement("div");
bubble.classList.add("bubble");

bubble.innerText=msg.text;

row.appendChild(bubble);

messages.appendChild(row);

messages.scrollTop=messages.scrollHeight;

playSound(msg.user);

});

function playSound(sender){

if(sender===currentUser) return;

const audio=document.getElementById("notificationSound");

if(audio){
audio.currentTime=0;
audio.play();
}

}

});
