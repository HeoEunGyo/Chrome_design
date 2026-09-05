const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input"); // 첫번째 input을 선택함
const greeting = document.querySelector("#greeting");
const backButton = document.querySelector("#back-button");

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";

function onLoginSubmit(event) {
  event.preventDefault(); // 브라우저의 기본 동작을 막음. (새로고침 방지)
  const username = loginInput.value;
  loginForm.classList.add(HIDDEN_CLASSNAME);
  localStorage.setItem(USERNAME_KEY, username);
  paintGreetings(username);
}

function paintGreetings(username) {
  greeting.innerText = `Hello ${username}`;
  greeting.classList.remove(HIDDEN_CLASSNAME);
  document.body.classList.add("is-logged-in");
} // localStorage에 정보 있으면 -> savedUsername을 보여주는 function 실행
// lovalStorage에 정보 없는데 처음으로 유저가 입력하면 -> loginInput에 있는 값을 받아옴 (=username)

function onBackClick() {
  // 저장된 이름만 지우고, 다시 로그인 화면으로 돌아간다.
  localStorage.removeItem(USERNAME_KEY);
  document.body.classList.remove("is-logged-in");
  greeting.classList.add(HIDDEN_CLASSNAME);
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  loginInput.value = "";
}

loginForm.addEventListener("submit", onLoginSubmit);
backButton.addEventListener("click", onBackClick);

const savedUsername = localStorage.getItem(USERNAME_KEY);

if (savedUsername === null) {
  //show the form
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  loginForm.addEventListener("submit", onLoginSubmit);
} //localStorage에 정보 없으면 -> loginForm에서 submit를 기다려
else {
  // show the greetings
  paintGreetings(savedUsername);
} // localStorage에 정보 있으면 -> savedUsername을 보여주는 function 실행
