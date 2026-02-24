import { getDatabase, ref, push, onValue, update, remove } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

  const db = getDatabase();
  const tasksRef = ref(db, "tasks");

  const title = container.querySelector("#title");
  const assignee = container.querySelector("#assignee");
  const due = container.querySelector("#due");
  const list = container.querySelector("#list");

  container.querySelector("#add").onclick = () => {

    if (!title.value) return;

    push(tasksRef, {
      title: title.value,
      assignee: assignee.value,
      due: due.value,
      done: false,
      createdAt: Date.now()
    });

    title.value = "";
    due.value = "";
  };

  onValue(tasksRef, snapshot => {

    list.innerHTML = "";

    snapshot.forEach(child => {

      const task = child.val();
      const id = child.key;

      const div = document.createElement("div");
      div.style.borderBottom = "1px solid #ddd";
      div.style.padding = "8px";

      div.innerHTML = `
        <input type="checkbox" ${task.done ? "checked" : ""}>
        <strong>${task.title}</strong>
        (${task.assignee || "未指定"})
        ${task.due ? "📅 " + task.due : ""}
        <button style="float:right">削除</button>
      `;

      const checkbox = div.querySelector("input");
      const delBtn = div.querySelector("button");

      checkbox.onchange = () => {
        update(ref(db, "tasks/" + id), { done: checkbox.checked });
      };

      delBtn.onclick = () => {
        remove(ref(db, "tasks/" + id));
      };

      list.appendChild(div);
    });

  });
registerListener(() => off(ref));
}
