const toDoForm = document.getElementById("todo-form");
const toDoInput = document.querySelector("#todo-form input");
const toDoList = document.getElementById("todo-list");

const TODOS_KEY = "todos";
let toDos = [];

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(event) {
  const li = event.currentTarget.parentElement;
  // event.currentTarget는 button을 가리키고, 그 부모인(=parentElement) li를 가져와서 삭제
  toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id)); // li.id는 string이므로, toDo.id와 비교하기 위해서는 toDo.id를 string으로 변환해야 한다.
  // toDo는 toDos 배열 안에 있는 각각의 toDoObj를 의미한다.
  li.remove();
  saveToDos();
}

function paintToDo(newToDo) {
  const li = document.createElement("li");
  li.id = newToDo.id; // newToDoObj의 id를 가져와서 li에 넣어주기
  const span = document.createElement("span");
  span.innerText = newToDo.text; // newToDoObj의 text를 가져와서 span에 넣어주기
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", "Delete");
  button.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="7" y="8" width="10" height="11" rx="1.2" stroke="#111111" stroke-width="1.4"/><path d="M9.5 8V6.8C9.5 6.36 9.86 6 10.3 6H13.7C14.14 6 14.5 6.36 14.5 6.8V8" stroke="#111111" stroke-width="1.4"/><path d="M6 8H18" stroke="#111111" stroke-width="1.4" stroke-linecap="round"/><path d="M10 11.5V16" stroke="#111111" stroke-width="1.4" stroke-linecap="round"/><path d="M14 11.5V16" stroke="#111111" stroke-width="1.4" stroke-linecap="round"/></svg>';
  button.addEventListener("click", deleteToDo);
  li.appendChild(span);
  li.appendChild(button);
  toDoList.appendChild(li);
}

function handleToDoSubmit(event) {
  event.preventDefault();
  const newToDo = toDoInput.value;
  toDoInput.value = "";
  const newToDoObj = {
    text: newToDo,
    id: Date.now(),
  };
  toDos.push(newToDoObj);
  paintToDo(newToDoObj);
  saveToDos();
} //todo-list에서 submit 반응이 일어나면!
// 'newToDo' 라는 변수 안에다가 Input.value값 넣고!
// 그 값을 paindToDo로 보내라!

toDoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);

// parse = 분석해서 알아볼 수 있는 형태로 변환하다
if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos);
  // toDos.push(...parsedToDos);
  toDos = parsedToDos;
  parsedToDos.forEach(paintToDo);
}
