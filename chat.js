document.addEventListener("DOMContentLoaded", function() {

  const input = document.querySelector(".input-area input");
  const sendBtn = document.querySelector(".input-area button");
  const messages = document.querySelector(".messages");

  if(!input || !sendBtn || !messages){
    console.log("チャット要素が見つかりません");
    return;
  }

  function getTime(){
    const now = new Date();
    return now.getHours().toString().padStart(2,"0") + ":" +
           now.getMinutes().toString().padStart(2,"0");
  }

  function addMessage(text,type="me"){

    const row = document.createElement("div");
    row.className = "message-row " + type;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerText = text;

    const meta = document.createElement("div");
    meta.className = "meta";

    if(type === "me"){
      meta.innerText = getTime() + " 既読1";
    }else{
      meta.innerText = getTime();
    }

    row.appendChild(bubble);
    row.appendChild(meta);

    messages.appendChild(row);
    messages.scrollTop = messages.scrollHeight;
  }

  sendBtn.addEventListener("click", function(){
    const text = input.value.trim();
    if(text === "") return;

    addMessage(text,"me");
    input.value = "";
  });

  input.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
      sendBtn.click();
    }
  });

});
