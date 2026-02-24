import { render as loginRender } from "./login.js";

const app = document.getElementById("app");

const savedUser = localStorage.getItem("familyUser");

if (savedUser) {
  // ⭐ 自動ログイン
  import("./chat.js").then(mod => {
    mod.render(app);
  });

} else {
  loginRender(app);
}
