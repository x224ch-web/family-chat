importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "YOUR_SENDER_ID"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {

  const title = "Family Chat";
  const options = {
    body: payload.notification.body,
    icon: "/images/icon.png"
  };

  return self.registration.showNotification(title, options);

});
