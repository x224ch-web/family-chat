import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { render as loginRender } from "./login.js";

// 🔹 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyC8qlv0imeiH6Vw_qu8295D_wno1xvEpKc",
  authDomain: "x224ch-c937f.firebaseapp.com",
  databaseURL: "https://x224ch-c937f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "x224ch-c937f",
  storageBucket: "x224ch-c937f.appspot.com",
  messagingSenderId: "217831065440",
  appId: "1:217831065440:web:c15038f05ede6973448005"
};

// ⭐ Firebase 初期化
initializeApp(firebaseConfig);

// ⭐ アプリ開始
const app = document.getElementById("app");
loginRender(app);
