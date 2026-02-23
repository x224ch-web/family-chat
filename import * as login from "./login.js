export function render(container) {

  container.innerHTML = `
    <h3>秘密のパスコードは、1234 です。</h3>

    <input id="familyCode" placeholder="パスコード">

    <select id="userSelect">
      <option value="">あなたは誰？</option>
      <option>まよ</option>
      <option>ほのか</option>
      <option>りょう</option>
      <option>しゅん</option>
      <option>さとし</option>
    </select>

    <button id="loginBtn">入室</button>
  `;

  document.getElementById("loginBtn").onclick = () => {
    const code = document.getElementById("familyCode").value;

    if (code === "1234") {
      import("./chat.js").then(mod => mod.render(container));
    } else {
      alert("パスコード違います");
    }
  };
}
