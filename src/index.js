import "./styles.css";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskRoot = document.querySelector(".tasks");
const tasklist = taskRoot.querySelector(".task-list");
const count = taskRoot.querySelector(".task-count");
const clear = taskRoot.querySelector(".clear-task");
const form = document.forms.tasks;
const field = form.elements.Task;

function saveTaskToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render(tasks) {
  let taskString = "";
  tasks.forEach((t, index) => {
    taskString += `<li data-id =${index} ${
      t.complete ? 'class="task-complete"' : ""
    }>
    <input type="checkbox" ${t.complete ? "checked" : ""}/> 
    <span>${t.new_task}</span>
    <button></button>
  </li>`;
  });
  count.innerText = tasks.filter((task) => !task.complete).length;
  tasklist.innerHTML = taskString;
  field.value = "";
  clear.style.display = tasks.filter((task) => task.complete).length
    ? "block"
    : "none";
}
function deleteTask(e) {
  if (e.target.nodeName.toLowerCase() !== "button") {
    return;
  }
  let id = parseInt(e.target.parentNode.getAttribute("data-id"), 10);
  const text = e.target.previousElementSibling.innerText;
  if (window.confirm(`Do you want to delete ${text} ?`)) {
    tasks = tasks.filter((task, index) => index !== id);
    render(tasks);
    saveTaskToStorage(tasks);
  }
}

function getTask(e) {
  e.preventDefault();
  let new_task = field.value.trim();
  const complete = false;
  tasks = [...tasks, { new_task, complete }];
  render(tasks);
  saveTaskToStorage(tasks);
  field.value = "";
}

function updateTask(e) {
  const id = parseInt(e.target.parentNode.getAttribute("data-id"), 10);
  let complete = e.target.checked;
  tasks = tasks.map((task, index) => {
    if (index === id) {
      return { ...task, complete };
    }
    return task;
  });
  render(tasks);
  saveTaskToStorage(tasks);
}

function deleteCompleted() {
  let count = tasks.filter((task) => task.complete).length;
  if (count == 0) {
    return;
  }
  if (window.confirm(`Do you want to delete ${count} task ?`)) {
    tasks = tasks.filter((task) => !task.complete);
    render(tasks);
    saveTaskToStorage(tasks);
  }
}

function modTask(e) {
  if (e.target.nodeName.toLowerCase() !== "span") {
    return;
  }
  const id = parseInt(e.target.parentNode.getAttribute("data-id"), 10);
  const textTask = tasks[id].new_task;

  const input = document.createElement("input");
  input.type = "text";
  input.value = textTask;

  function handleInput(e) {
    e.stopPropagation();
    const new_task = input.value;
    if (input.value !== textTask) {
      tasks = tasks.map((task, index) => {
        if (index == id) {
          return { ...task, new_task };
        }
        return task;
      });
    }
    render(tasks);
    saveTaskToStorage(tasks);
    e.target.style.display = "";
    input.removeEventListener("change", handleInput);
    input.remove();
  }

  e.target.style.display = "none";
  e.target.parentNode.append(input);
  input.addEventListener("change", handleInput);
}

function init() {
  render(tasks);
  form.addEventListener("submit", getTask);
  tasklist.addEventListener("change", updateTask);
  tasklist.addEventListener("click", deleteTask);
  tasklist.addEventListener("dblclick", modTask);
  clear.addEventListener("click", deleteCompleted);
}

init();
