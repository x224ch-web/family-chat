const CACHE_NAME = "family-chat-v3";

const urlsToCache = [

"./",
"./index.html",
"./style.css",
"./login.js",
"./chat.js",
"./icon-192.png",
"./icon-512.png"

];

/* ===============================
INSTALL
=============================== */

self.addEventListener("install", event => {

event.waitUntil(

caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))

);

self.skipWaiting();

});


/* ===============================
ACTIVATE
=============================== */

self.addEventListener("activate", event => {

event.waitUntil(

caches.keys().then(cacheNames => {

return Promise.all(

cacheNames.map(cache => {

if(cache !== CACHE_NAME){

return caches.delete(cache);

}

})

);

})

);

self.clients.claim();

});


/* ===============================
FETCH
=============================== */

self.addEventListener("fetch", event => {

event.respondWith(

caches.match(event.request)
.then(response => {

return response || fetch(event.request);

})

);

});
