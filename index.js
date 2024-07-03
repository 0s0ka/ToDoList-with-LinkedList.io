// реализация конструктора классов Node и LinkedList
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  // cсоздание методов для конструктора класса
  //
  // реализация метода LinkedList добавления нового node
  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }
  // реализация метода LinkedList удаления node
  remove(id) {
    if (!this.head) return;

    if (this.head.value.id === id) {
      this.head = this.head.next;
      this.size--;
      return;
    }
    let current = this.head;
    let previous = null;
    while (current && current.value.id !== id) {
      previous = current;
      current = current.next;
    }

    if (current) {
      previous.next = current.next;
      this.size--;
    }
  }
  // реализация метода LinkedList удаления всех nodes
  removeAll() {
    this.head = null;
    this.size = 0;
  }
  // реализация метода LinkedList удаления всех выполненных nodes
  removeCompleted() {
    let current = this.head;
    let previous = null;
    while (current) {
      if (current.value.isDone) {
        if (previous) {
          previous.next = current.next;
        } else {
          this.head = current.next;
        }
        this.size--;
      } else {
        previous = current;
      }
      current = current.next;
    }
  }
  // реализация метода LinkedList получения всех элементов списка
  getAll() {
    let current = this.head;
    const values = [];
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    return values;
  }

  // реализация метода LinkedList сохранения в LocalStorage
  saveToLocalStorage() {
    const tasks = this.getAll();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  // реализация метода LinkedList загрузки из LocalStorage
  loadFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => this.add(task));
  }
}

// создание самого списка дел (экземпляра класса LinkedList)
class ToDoList {
  constructor() {
    this.tasks = new LinkedList();
    this.tasks.loadFromLocalStorage();
  }

  // cсоздание методов для управления тасками
  //
  // создание таски
  addTask(task) {
    this.tasks.add({ id: Date.now(), task, isDone: false });
    this.tasks.saveToLocalStorage();
  }
  // удаление таски
  removeTask(task) {
    this.tasks.remove(task.id);
    this.tasks.saveToLocalStorage();
  }
  // удаление всех тасок
  removeAllTasks() {
    this.tasks.removeAll();
    this.tasks.saveToLocalStorage();
  }
  // удаление всех выполненных тасок
  removeCompletedTasks() {
    this.tasks.removeCompleted();
    this.tasks.saveToLocalStorage();
  }
  // удаление всех выполненных тасок
  toggleTask(task) {
    let current = this.tasks.head;
    while (current) {
      if (current.value.id === task.id) {
        current.value.isDone = !current.value.isDone;
        break;
      }
      current = current.next;
    }
    this.tasks.saveToLocalStorage();
  }
  // получение всех тасок
  getAllTasks() {
    return this.tasks.getAll();
  }
}

// реализация слушателей и хендлеров, создание экземпляра класса
const toDoList = new ToDoList();
const taskInput = document.querySelector("#new_task");
const addTaskBtn = document.querySelector("#add_task");
const taskListElem = document.querySelector("#task_list");
const taskForm = document.querySelector("#task_form");
const deleteAllBtn = document.querySelector("#footer__delete_all");
const deleteFinishedBtn = document.querySelector("#footer__delete_finished");
const footerElement = document.querySelector("#footer");

// реализация метода отрисовки нового элемента списка
function renderTasks() {
  taskListElem.innerHTML = "";
  const tasks = toDoList.getAllTasks();
  tasks.forEach((taskObj) => {
    const li = document.createElement("li");
    li.classList.add("list__item_wr");
    li.innerHTML = `<div class="item_wr">
            <input class="list__checkbox" type="checkbox" ${
              taskObj.isDone ? "checked" : ""
            } />
            <p class="list__item ${taskObj.isDone ? "done" : ""}">
              ${taskObj.task}
            </p>
          </div>
          <button class="list__btn">❌</button>`;
    li.querySelector(".list__checkbox").addEventListener("click", () => {
      toDoList.toggleTask(taskObj);
      renderTasks();
    });

    li.querySelector(".list__btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toDoList.removeTask(taskObj);
      renderTasks();
    });
    taskListElem.appendChild(li);
  });
  if (tasks.length === 0) {
    taskListElem.style.display = "none"
    footerElement.style.display = "none";
  } else {
    taskListElem.style.display = "block";
    footerElement.style.display = "flex";
  }
}

// реализация добавления элемента по нажатию на кнопку
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTask = taskInput.value.trim();
  if (newTask) {
    toDoList.addTask(newTask);
    taskInput.value = "";
    renderTasks();
  }
});
// реализация удаления всех тасок
deleteAllBtn.addEventListener("click", () => {
  toDoList.removeAllTasks();
  renderTasks();
});
// реализация удаления выполненных тасок
deleteFinishedBtn.addEventListener("click", () => {
  toDoList.removeCompletedTasks();
  renderTasks();
});
// отрисовка списка задач при загрузке страницы
renderTasks();
