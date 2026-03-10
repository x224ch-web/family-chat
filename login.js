document.querySelectorAll(".card").forEach(card=>{

card.onclick=()=>{

const user=card.dataset.user;

localStorage.setItem("currentUser",user);

location.reload();

};

});
