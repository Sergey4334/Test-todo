import "../scss/main.scss";
import "../index.html";
import "../img/Frame.svg";
//import $ from "jquery";

const now = new Date(2021, 3, 19);
const op = {
  day: "numeric",
  month: "long",
  year: "numeric",
};
const resultDate = now.toLocaleString("en-US", op);
const dateNow = document.querySelector(".form-item .input-check .date-now");
const span = document.createElement("span");
span.textContent = resultDate;
dateNow.insertAdjacentElement("afterbegin", span);
// console.log(span);

//Resise TextArea
var observe;
if (window.attachEvent) {
  observe = function (element, event, handler) {
    element.attachEvent("on" + event, handler);
  };
} else {
  observe = function (element, event, handler) {
    element.addEventListener(event, handler, false);
  };
}
function init() {
  var text = document.getElementById("text");
  function resize() {
    text.style.height = "auto";
    text.style.height = text.scrollHeight + "px";
  }
  /* 0-timeout to get the already changed text */
  function delayedResize() {
    window.setTimeout(resize, 0);
  }
  observe(text, "change", resize);
  observe(text, "cut", delayedResize);
  observe(text, "paste", delayedResize);
  observe(text, "drop", delayedResize);
  observe(text, "keydown", delayedResize);

  text.focus();
  text.select();
  resize();
}
init();

//Render Tasks

const tasks = [
  {
    _id: "5d2ca9e2e03d40b326596aa7",
    completed: true,
    title: "Eu ea incididunt sunt consectetur fugiat non.",
  },
  {
    _id: "5d2ca9e29c8a94095c1288e0",
    completed: false,
    title: "Pariatur nulla reprehenderit ipsum.",
  },
];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  const form = document.forms["addTask"];
  const inputTask = form.elements["task"];
  const listContainer = document.querySelector(".list-task");

  //Event
  form.addEventListener("submit", onFormSubmit);
  listContainer.addEventListener("click", onDeleteHandler);

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.log("Передайте список задач");
      return;
    }
    const fragment = document.createDocumentFragment();

    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  function listItemTemplate({ _id, title } = {}) {
    const formItem = document.createElement("div");
    formItem.classList.add("form-item");
    formItem.setAttribute("data-task-id", _id);

    const inputCheck = document.createElement("div");
    inputCheck.classList.add("input-check");

    const checkbox = document.createElement("input");
    checkbox.classList.add("custom-checkbox");
    checkbox.setAttribute("type", "checkbox");
    const datenow = document.createElement("div");
    datenow.classList.add("date-now");

    inputCheck.appendChild(checkbox);
    inputCheck.appendChild(datenow);

    const inputedit = document.createElement("div");
    inputedit.classList.add("input-edit");

    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("delete-task", "delete-btn");
    const edittask = document.createElement("div");
    edittask.classList.add("edit-task");

    inputedit.appendChild(edittask);
    inputedit.appendChild(deleteBtn);

    const inputform = document.createElement("div");
    inputform.classList.add("input-form");
    const TextArea = document.createElement("textarea");
    TextArea.classList.add("task-input");
    TextArea.id = "text";
    TextArea.setAttribute("placeholder", title);
    TextArea.setAttribute("name", "task");
    TextArea.setAttribute("row", "1");
    inputform.appendChild(TextArea);

    //* Добавляем елементы в наш список LI
    formItem.appendChild(inputCheck);
    formItem.appendChild(inputedit);
    formItem.appendChild(inputform);

    return formItem;
  }

  //Form Sumit Fu
  function onFormSubmit(e) {
    e.preventDefault();
    const titleValue = inputTask.value;
    if (!titleValue) {
      alert("Please Enter Task description!");
      return;
    }
    const task = createNewTask(titleValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };
    objOfTasks[newTask._id] = newTask;
    return { ...newTask };
  }
  function deleteTask(id) {
    const { title } = objOfTasks[id];
    const isConfirm = confirm(`Хотите удалить задачу: ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }
  function deleteTaskFromHtml(confirm, el) {
    if (!confirm) return;
    el.remove();
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirm = deleteTask(id);
      deleteTaskFromHtml(confirm, parent);
    }
  }
})(tasks);
