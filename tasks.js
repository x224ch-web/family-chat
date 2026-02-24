export function render(container) {

  container.innerHTML = `
    <div style="padding:16px;">
      <h2>タスク</h2>

      <input id="title" placeholder="やること"><br><br>

      <select id="assignee">
        <option value="">担当者</option>
        <option>まよ</option>
        <option>ほのか</option>
        <option>りょう</option>
        <option>しゅん</option>
        <option>さとし</option>
      </select><br><br>

      <input id="due" type="date"><br><br>

      <button id="add">追加</button>

      <hr>

      <div id="list"></div>
    </div>
  `;

}
