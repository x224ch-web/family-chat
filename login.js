/* ===============================
   login
=============================== */

document.querySelectorAll(".card").forEach(card=>{
  card.addEventListener("click",()=>{
    const user = card.dataset.user;
    localStorage.setItem("currentUser", user);
    location.reload();
  });
});


/* ===============================
   unread badge
=============================== */

const users = ["mayo","honoka","ryo","shun","satoshi"];
const db = firebase.database().ref("messages");

db.on("value", snap => {

  const data = snap.val();
  if(!data) return;

  const unread = {};
  users.forEach(u => unread[u] = 0);

  Object.values(data).forEach(msg=>{
    users.forEach(u=>{
      if(msg.user !== u && (!msg.reads || !msg.reads[u])){
        unread[u]++;
      }
    });
  });

  users.forEach(u=>{
    const badge = document.getElementById("badge-"+u);
    if(!badge) return;

    badge.style.display = unread[u] ? "block" : "none";
    badge.innerText = unread[u] || "";
  });

});
