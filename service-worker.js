importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC8qlv0imeiH6Vw_qu8295D_wno1xvEpKc",
  authDomain: "x224ch-c937f.firebaseapp.com",
  databaseURL: "https://x224ch-c937f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "x224ch-c937f",
  messagingSenderId: "217831065440",
  appId: "1:217831065440:web:c15038f05ede6973448005"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Background message received:", payload);

  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon.png"
    }
  );
});
