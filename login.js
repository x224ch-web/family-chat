const SECRET_CODE = "1234";

export function render(container) {

  container.innerHTML = `
    <div style="padding:20px;">
      <h3>家族チャットにログイン</h3>

      <input id="familyCode" type="password" placeholder="パスコード"><br><br>

      <select id="userSelect">
        <option value="">あなたは誰？</option>
        <option>まよ</option>
        <option>ほのか</option>
        <option>りょう</option>
        <option>しゅん</option>
        <option>さとし</option>
      </select><br><br>

      <button id="loginBtn">入室</button>
    </div>
  `;

  const btn = container.querySelector("#loginBtn");

  btn.onclick = () => {

    const code = container.querySelector("#familyCode").value;
    const user = container.querySelector("#userSelect").value;

    if (code !== SECRET_CODE) {
      alert("パスコード違います");
      return;
    }

    if (!user) {
      alert("名前を選んでください");
      return;
    }

    localStorage.setItem("familyUser", user);

import("./chat.js").then(mod => {
  mod.render(container);
});

  };

}
