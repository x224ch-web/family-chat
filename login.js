alert("login.js loaded");
export function render(container) {

  console.log("login render start");

  container.innerHTML = `
    <div style="padding:20px;">
      <h3>秘密のパスコードは、1234 です。</h3>

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

  const btn = document.getElementById("loginBtn");

  btn.addEventListener("click", () => {

    console.log("login click");

    const code = document.getElementById("familyCode").value;
    const user = document.getElementById("userSelect").value;

    if (code !== "1234") {
      alert("パスコード違います");
      return;
    }

    if (!user) {
      alert("名前を選んでください");
      return;
    }

    import("./chat.js")
      .then(mod => {
        console.log("chat load OK");
        mod.render(container);
      })
      .catch(err => {
        console.error(err);
        alert("chat.js 読み込み失敗");
      });

  });

}
