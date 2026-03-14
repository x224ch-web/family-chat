let listeners = [];

/* ===============================
   listener register
=============================== */

export function registerListener(unsubscribe){
  listeners.push(unsubscribe);
}

export function clearListeners(){
  listeners.forEach(fn=>fn());
  listeners=[];
}


/* ===============================
   unread badge listener
=============================== */

export function startUnreadListener(){

  const users=["mayo","honoka","ryo","shun","satoshi"];
  const db=firebase.database().ref("messages");

  const callback = snap => {

    const data=snap.val();
    if(!data) return;

    const unread={};
    users.forEach(u=>unread[u]=0);

    Object.values(data).forEach(msg=>{
      users.forEach(u=>{
        if(msg.user!==u && (!msg.reads || !msg.reads[u])){
          unread[u]++;
        }
      });
    });

    users.forEach(u=>{
      const badge=document.getElementById("badge-"+u);
      if(!badge) return;

      badge.style.display = unread[u] ? "block" : "none";
      badge.innerText = unread[u] || "";
    });

  };

  db.on("value",callback);

  registerListener(()=>{
    db.off("value",callback);
  });

}
