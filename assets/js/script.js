const API = '720ca2f438ef901daf90b80e8e62cbeb';
const searchButton = document.getElementById("search-button");

// Uses the Geocoding API to search for cities matching the input text, retrieving details like latitude and longitude

// Retrieves stored city names from localStorage or initializes a new array for storing data
const searchData = JSON.parse(localStorage.getItem("searchResults")) || [];

// Main container for displaying weather results
const container = document.getElementById("container");
const forecast = document.getElementById('forecast');

// Container for search history section
const history = document.getElementById("history");

function fetchCity(data) {
  const city = document.getElementById("form1").value.trim();
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=449e0f70c68d023360a6656f43c00e19`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location not found");
      } else {
        fetchWeather(data[0]);
        storeData(city);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchHistory(cityName) {
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=449e0f70c68d023360a6656f43c00e19`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location not found");
      } else {
        fetchWeather(data[0]);
        // storeData(cityName);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

// Fetches weather details using the city's latitude and longitude extracted from the city data above
function fetchWeather(searchedCity) {
  const { lat } = searchedCity;
  const { lon } = searchedCity;

  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=449e0f70c68d023360a6656f43c00e19`;

  fetch(weatherUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data) {
        alert("openWeather API is not working properly");
      } else {
        renderCurrentWeather(searchedCity, data);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  createHistory();
}

// Converts the data to a string and stores it in localStorage; adds new searches to the Recent Searches list
function storeData(searchCity) {
  searchData.push(searchCity);
  // Stringify the searchData array and store it in localStorage
  localStorage.setItem("searchResults", JSON.stringify(searchData));
}

// Creates buttons in the Recent Searches section for each city stored in localStorage
function createHistory() {
  history.textContent = '';
  searchData.forEach((city) => {
    // Creates a <button> for each city in the search history
    const recentSearches = document.getElementById("history");
    const cityBtn = document.createElement("button");
    cityBtn.classList.add("btn-btn-light", "city-button");
    cityBtn.textContent = city;
    // Appends buttons to the #history container
    history.append(cityBtn);
  });
}

// Displays current weather and forecast for the selected city
function renderCurrentWeather(city, weather) {
  console.log(weather); // Log weather data for testing purposes

  // Clear previous weather results
  container.textContent = '';

  // Extract necessary data from the weather object
  const cityName = weather.city.name;
  const date = weather.list[0].dt_txt;
  const temp = weather.list[0].main.temp;
  const wind = weather.list[0].wind.speed;
  const humid = weather.list[0].main.humidity;
  const icon = weather.list[0].weather[0].icon;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

  // Create HTML elements for displaying weather data
  const mainCard = document.createElement('div');
  mainCard.classList.add('card', 'col-8', 'mainCard', 'bg-info', 'align-self-left', 'm-3');
  const cityH5 = document.createElement('h5');
  const dateH6 = document.createElement('h6');
  const iconImg = document.createElement('img');
  const tempH6 = document.createElement('h6');
  const windH6 = document.createElement('h6');
  const humidH6 = document.createElement('h6');

  // Populate elements with relevant data
  cityH5.textContent = cityName;
  dateH6.textContent = date;
  iconImg.setAttribute("src", iconUrl);
  tempH6.textContent = `Temperature: ${temp}\u00B0`;
  windH6.textContent = `Wind Speed: ${wind} mph`;
  humidH6.textContent = `Humidity: ${humid}`;

  // Append the data card to the main container
  container.append(mainCard);
  mainCard.append(cityH5, dateH6, iconImg, tempH6, windH6, humidH6);

  // Prepare the 5-day weather forecast, clear previous data
  forecast.textContent = '';

  for (let i = 1; i < 6; i++) {
    // Extract forecast data for each day
    const cityName = weather.city.name;
    const date = weather.list[i*8-1].dt_txt;
    const temp = weather.list[i*8-1].main.temp;
    const wind = weather.list[i*8-1].wind.speed;
    const humid = weather.list[i*8-1].main.humidity;
    const icon = weather.list[i*8-1].weather[0].icon;

    // Create forecast cards for each day
    const dayCard = document.createElement('div');
    dayCard.classList.add('card', 'col-2', 'dayCard', 'bg-primary', 'align-self-left', 'm-3');
    const cityH5 = document.createElement('h5');
    const dateH6 = document.createElement('h6');
    const iconImg = document.createElement('img');
    const tempH6 = document.createElement('h6');
    const windH6 = document.createElement('h6');
    const humidH6 = document.createElement('h6');

    // Populate elements with weather data for the forecast
    cityH5.textContent = cityName;
    dateH6.textContent = date;
    iconImg.setAttribute("src", iconUrl);
    tempH6.textContent = `Temperature: ${temp}\u00B0`;
    windH6.textContent = `Wind Speed: ${wind} mph`;
    humidH6.textContent = `Humidity: ${humid}`;

    // Append forecast cards to the forecast container
    dayCard.append(cityH5, dateH6, iconImg, tempH6, windH6, humidH6);
    forecast.append(dayCard);
  }
}

// Handles recall of weather data when a city from the history is clicked
function weatherRecall(e) {
  if (!e.target.matches('.city-button')) {
    return;
  }
  const target = e.target;
  const cityName = target.textContent;
  fetchHistory(cityName);
  console.log(cityName);
}

// Event listeners to handle search and history interactions
searchButton.addEventListener('click', fetchCity);
history.addEventListener('click', weatherRecall);
createHistory();