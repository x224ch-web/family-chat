alert("login.js loaded");

const SECRET_CODE = "1234";

export function render(container) {

  console.log("login render start");

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

  const btn = document.getElementById("loginBtn");

  btn.addEventListener("click", async () => {

    btn.disabled = true;

    console.log("login click");

    const code = document.getElementById("familyCode").value;
    const user = document.getElementById("userSelect").value;

    if (code !== SECRET_CODE) {
      alert("パスコード違います");
      btn.disabled = false;
      return;
    }

    if (!user) {
      alert("名前を選んでください");
      btn.disabled = false;
      return;
    }

    try {
      const mod = await import("./chat.js");
      console.log("chat load OK");
      mod.render(container);

    } catch (err) {
      console.error("chat load error:", err);
      alert("chat.js 読み込み失敗");
      btn.disabled = false;
    }

  });

}
