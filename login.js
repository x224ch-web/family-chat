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


