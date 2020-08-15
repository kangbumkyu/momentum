const API_KEY = "8193472a79afeac2be2aa7e735c94ea3";
const LS_NAME = "name";
const LS_TODOS = "todos";
const LS_INFO = "information";
const time = document.querySelector(".timer");
const greetContainer = document.querySelector(".greeting-container");
const greeting = greetContainer.querySelector(".greeting");
const nameForm = document.createElement("form");
const nameInput = document.createElement("input");
const todoContainer = document.querySelector(".todoInput-container");
const todoForm = document.createElement("form");
const todoInput = document.createElement("input");
const todoListContainer = document.querySelector(".todolist-container");
const todoList = document.createElement("div");
const city = document.querySelector(".info__city");
const temp = document.querySelector(".info__temp");

let hours;
let mins;
let todos = [];

function initName() {
  const name = localStorage.getItem(LS_NAME);
  if (name) {
    greeting.innerHTML = `Hello, ${name}`;
    initTodo();
  } else {
    // SHOW INPUT;
    todoListContainer.classList.add("hide");
    nameForm.addEventListener("submit", handleSetName);
    nameInput.placeholder = "What is your name?";
    nameForm.appendChild(nameInput);
    greetContainer.appendChild(nameForm);
  }
}
function handleSetName(event) {
  event.preventDefault();
  const name = nameInput.value;
  localStorage.setItem(LS_NAME, name);
  greeting.innerHTML = `Hello, ${name}`;
  greetContainer.removeChild(nameForm);
  initTodo();
}

function getImage() {
  const image = new Image();
  image.classList.add("image-background");
  image.src = "https://source.unsplash.com/1600x900/?nature";

  document.body.appendChild(image);
}

function getTime() {
  const date = new Date();
  hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  mins = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  time.innerHTML = `${hours}:${mins}`;
}
function handleSetTodo(event) {
  event.preventDefault();
  if (todos.length < 5) {
    const todo = {
      //   id: todos.length + 1,
      todo: todoInput.value,
      done: false,
    };
    todos.push(todo);
    console.log(todos);
    localStorage.setItem(LS_TODOS, JSON.stringify(todos));
    const item = createTodoItem(todo);
    todoList.appendChild(item);
  } else {
    alert("Maximum is 5");
  }
}

function handleCheck(event) {
  const checkbox = event.target;
  const text = event.target.nextSibling;

  let checked;
  if (checkbox.checked) {
    text.classList.add("line-through");
    checked = true;
  } else {
    checked = false;
    text.classList.remove("line-through");
  }
  todos.forEach(function (todo) {
    if (todo.todo === checkbox.value) {
      if (checked) {
        todo.done = true;
      } else {
        todo.done = false;
      }
    }
  });
  localStorage.setItem(LS_TODOS, JSON.stringify(todos));
}
function handleRemove(event) {
  const title = event.target.previousSibling.innerHTML;

  const filtered = todos.filter(function (todo) {
    if (todo.todo === title) {
      return false;
    } else {
      return true;
    }
  });
  todos = filtered;
  localStorage.setItem(LS_TODOS, JSON.stringify(todos));
  updateTodoList();
}
function updateTodoList() {
  todoList.innerHTML = "";
  todos.forEach(function (todo) {
    const item = createTodoItem(todo);

    todoList.appendChild(item);
  });
}
function createTodoItem(todo) {
  const item = document.createElement("div");
  item.classList.add("todolist__item");
  const checkbox = document.createElement("INPUT");
  checkbox.classList.add("todolist__checkbox");
  checkbox.setAttribute("type", "checkbox");
  checkbox.value = todo.todo;
  checkbox.addEventListener("change", handleCheck);

  item.appendChild(checkbox);
  const text = document.createElement("span");
  text.innerHTML = todo.todo;
  if (todo.done) {
    checkbox.checked = true;
    text.classList.add("line-through");
  } else {
    checkbox.checked = false;
    text.classList.remove("line-through");
  }
  item.appendChild(text);
  const remove = document.createElement("span");
  remove.classList.add("todolist__remove");
  remove.innerHTML = "remove";
  remove.addEventListener("click", handleRemove);
  item.appendChild(remove);
  return item;
}

function initTodo() {
  todoListContainer.classList.remove("hide");
  todoForm.addEventListener("submit", handleSetTodo);
  todoInput.placeholder = "Do you have work to do? (Max. 5 todos)";
  todoForm.appendChild(todoInput);
  todoContainer.appendChild(todoForm);

  const title = document.createElement("span");
  title.classList.add("todolist__title");
  title.innerHTML = "Today";
  todoListContainer.appendChild(title);

  todoList.classList.add("todolist__table");
  todoListContainer.appendChild(todoList);
  if (localStorage.getItem(LS_TODOS)) {
    todos = JSON.parse(localStorage.getItem(LS_TODOS));
    console.log(todos);

    // Show todo list
    todos.forEach(function (todo) {
      const item = createTodoItem(todo);
      todoList.appendChild(item);
    });
  }
}
function successPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  //   console.log(latitude, longitude);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
  console.log(url);
  fetch(url)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (json) {
      console.log(json);
      const info = {
        city: json.name,
        temperature: json.main.temp,
      };
      localStorage.setItem(LS_INFO, JSON.stringify(info));
      city.innerHTML = info.city;
      temp.innerHTML = `${info.temperature}℃`;
    });
}
function errorPosition() {
  console.log("can't get location");
}
function getGeoLocation() {
  navigator.geolocation.getCurrentPosition(successPosition, errorPosition);
}
function getWeather() {
  const info = JSON.parse(localStorage.getItem(LS_INFO));
  if (!info) {
    getGeoLocation();
  } else {
    city.innerHTML = info.city;
    temp.innerHTML = `${info.temperature}℃`;
  }
}
function init() {
  getImage();
  getWeather();
  setInterval(getTime, 1000);
  initName();
}

init();
