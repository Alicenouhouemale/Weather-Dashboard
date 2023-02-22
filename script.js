var apiKey = "28d26cfa250dc29eff9b27c5bc0fdeae";
var today = moment();
var searchHistoryList = [];

// Function for current condition

function currentCondition(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (cityWeatherResponse) {
    console.log(cityWeatherResponse);

    $("#weatherContent").css("display", "block");
    $("#cityDetail").empty();

    var iconCode = cityWeatherResponse.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/w/${iconCode}.png";

    // Displays city name, date, weather condition (temperature, humidity and wind speed with their icon) here!
    var currentCity = $(`
            <h2 id="currentCity">
                ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
            <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
            <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
        `);

    $("#cityDetail").append(currentCity);

    // UV index
    var lat = cityWeatherResponse.coord.lat;
    var lon = cityWeatherResponse.coord.lon;
    var uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    $.ajax({
      url: uviQueryURL,
      method: "GET",
    }).then(function (uviResponse) {
      console.log(uviResponse);

      var uvIndex = uviResponse.value;
      var uvIndexP = $(`
                <p>UV Index:<span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span></p>
            `);

      $("#cityDetail").append(uvIndexP);

      futureCondition(lat, lon);

      // Using traffic light colors to indicate UV index colors
      if (uvIndex >= 0 && uvIndex <= 2) {
        $("#uvIndexColor")
          .css("background-color", "#3EA72D")
          .css("color", "white");
      } else if (uvIndex >= 3 && uvIndex <= 5) {
        $("#uvIndexColor").css("background-color", "#FFF300");
      } else if (uvIndex >= 6 && uvIndex <= 7) {
        $("#uvIndexColor").css("background-color", "#F18B00");
      } else if (uvIndex >= 8 && uvIndex <= 10) {
        $("#uvIndexColor")
          .css("background-color", "#E53210")
          .css("color", "white");
      } else {
        $("#uvIndexColor")
          .css("background-color", "#B567A4")
          .css("color", "white");
      }
    });
  });
}
// function for future condition
function futureCondition(lat, lon) {
  var futureURL =
    "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

  $.ajax({
    url: futureURL,
    method: "GET",
  }).then(function (futureResponse) {
    console.log(futureResponse);
    $("#fiveDay").empty();

    for (let i = 1; i < 6; i++) {
      var cityInfo = {
        date: futureResponse.daily[i].dt,
        icon: futureResponse.daily[i].weather[0].icon,
        temp: futureResponse.daily[i].temp.day,
        humidity: futureResponse.daily[i].humidity,
      };

      var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
      var iconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;

      // Function to display future date, weather contidion icon, temperature and humidity
      var futureCard = $(`
            <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem;>
                    <div class="card-body">
                        <h5>${currDate}</h5>
                        <p>${iconURL}</p>
                        <p>Temp: ${cityInfo.temp} °F</p>
                        <p>Humidity: ${cityInfo.humidity}\%</p>
                    </div>
                </div>
            <div>
        `);

      $("#fiveDay").append(futureCard);
    }
  });
}

// Current and future conditions for a specific city
$("#searchBtn").on("click", function () {
  var listCity = $(this).text();
  currentCondition(listCity);
});

// Displays last city searched
$(document).ready(function () {
  var searchHistoryArr = JSON.parse(localStorage.getItem("city"));

  if (searchHistoryArr !== null) {
    var lastSearchedIndex = searchHistoryArr.length - 1;
    var lastSearchedCity = searchHistoryArr[lastSearchedIndex];
    currentCondition(lastSearchedCity);
    console.log(`Last searched city: ${lastSearchedCity}`);
  }
});
