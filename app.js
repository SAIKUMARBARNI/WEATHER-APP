const cityElement = document.querySelector(".weather__city");
const datetimeElement = document.querySelector(".weather__datetime");
const forecastElement = document.querySelector(".weather__forecast");
const iconElement = document.querySelector(".weather__icon");
const temperatureElement = document.querySelector(".weather__temperature");
const minMaxElement = document.querySelector(".weather__minmax");
const realFeelElement = document.querySelector(".weather__realfeel");
const humidityElement = document.querySelector(".weather__humidity");
const windElement = document.querySelector(".weather__wind");
const pressureElement = document.querySelector(".weather__pressure");
const searchForm = document.querySelector(".weather__search");
const searchInput = document.querySelector(".weather__searchform");
const locationBtn = document.querySelector(".weather__location-btn");
const celsiusUnit = document.querySelector(".weather_unit_celsius");
const fahrenheitUnit = document.querySelector(".weather_unit_farenheit");

const apiKey = "e9b258b833970b94a95b9403213f3b7c";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
let units = "metric";

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city !== "") {
    fetchWeatherData(city);
  }
  searchInput.value = "";
});

locationBtn.addEventListener("click", getCurrentLocationWeather);

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.log(error.message);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

async function fetchWeatherByCoordinates(latitude, longitude) {
  try {
    const response = await fetch(
      `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`
    );
    if (!response.ok) {
      throw new Error("Weather data not available.");
    }
    const data = await response.json();
    updateWeatherInfo(data);
  } catch (error) {
    console.log(error);
  }
}

celsiusUnit.addEventListener("click", () => {
  if (units !== "metric") {
    units = "metric";
    fetchWeatherData(cityElement.textContent); // Update weather data with new unit
  }
});

fahrenheitUnit.addEventListener("click", () => {
  if (units !== "imperial") {
    units = "imperial";
    fetchWeatherData(cityElement.textContent); // Update weather data with new unit
  }
});

async function fetchWeatherData(city) {
  try {
    const response = await fetch(
      `${baseUrl}?q=${city}&appid=${apiKey}&units=${units}`
    );
    if (!response.ok) {
      throw new Error("Weather data not available.");
    }
    const data = await response.json();
    updateWeatherInfo(data);
  } catch (error) {
    console.log(error);
  }
}

function updateWeatherInfo(data) {
  cityElement.textContent = data.name;
  datetimeElement.textContent = getCurrentTime();
  forecastElement.textContent = data.weather[0].description;
  iconElement.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">`;
  temperatureElement.innerHTML = `${Math.round(data.main.temp)}&#176;${
    units === "metric" ? "C" : "F"
  }`;
  minMaxElement.innerHTML = `<p>Min: ${data.main.temp_min}&#176;${
    units === "metric" ? "C" : "F"
  }</p><p>Max: ${data.main.temp_max}&#176;${
    units === "metric" ? "C" : "F"
  }</p>`;
  realFeelElement.innerHTML = `<p>${data.main.feels_like}&#176;${
    units === "metric" ? "C" : "F"
  }</p>`;
  humidityElement.textContent = `${data.main.humidity}%`;
  windElement.textContent = `${data.wind.speed} ${
    units === "imperial" ? "mph" : "m/s"
  }`;
  pressureElement.textContent = `${data.main.pressure} hPa`;
}

function getCurrentTime() {
  const date = new Date();
  return date.toLocaleString();
}

window.addEventListener("load", () => {
  fetchWeatherData("new delhi");
  datetimeElement.textContent = getCurrentTime();
});