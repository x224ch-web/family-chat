self.addEventListener("install",e=>{

e.waitUntil(

caches.open("familychat").then(cache=>{

return cache.addAll([

"/",
"/index.html",
"/style.css",
"/login.js",
"/chat.js"

]);

})

);

});
