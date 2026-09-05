const API_KEY = "936d112d69ddbc047d2b6ca95887ec99";

function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log("You live in - weather.js:6", lat, lon);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const weatherCondition = document.querySelector("#weather-condition");
      const temp = document.querySelector("#temp");
      const city = document.querySelector("#city");
      const weather = document.querySelector("#weather");

      weatherCondition.innerText = data.weather[0].main;
      temp.innerText = `${Math.round(data.main.temp)}°C`;
      city.innerText = data.name;
      weather.classList.add("is-ready");
    });
  //fetch는 "인터넷으로 데이터를 가져오거나 보내는 것"을 의미한다. fetch(url)로 url에 있는 데이터를 가져온다.
  console.log("url - weather.js:17", url);
}

function onGeoError() {
  alert("Can't find you. No weather for you.");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
