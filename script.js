const apiKey = '100e8c59802810c3159f037e8987a045'; // Your API Key

function getWeather() {
    let city = document.getElementById("city").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch Current Weather
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("city-name").innerHTML = `${data.name}, ${data.sys.country}`;
            document.getElementById("temperature").innerHTML = `Temperature: ${data.main.temp}°C`;
            document.getElementById("weather-description").innerHTML = `Weather: ${data.weather[0].description}`;
            document.getElementById("humidity").innerHTML = `Humidity: ${data.main.humidity}%`;
            document.getElementById("wind-speed").innerHTML = `Wind Speed: ${data.wind.speed} m/s`;

            // Update Weather Icon
            let iconCode = data.weather[0].icon;
            document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            // Change Background Gradient Based on Weather Condition
            changeBackground(data.weather[0].main);
        })
        .catch(error => console.log("Error fetching weather data", error));

    // Fetch Hourly & 5-Day Forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            let forecastHTML = "";
            let hourlyHTML = "";

            // Hourly Forecast: Next 24 hours (8 intervals, every 3 hours)
            let hourlyData = data.list.slice(0, 8);
            hourlyData.forEach(hour => {
                let time = new Date(hour.dt_txt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                let iconCode = hour.weather[0].icon;

                hourlyHTML += `
                    <div class="forecast-item">
                        <h4>${time}</h4>
                        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">
                        <p>${hour.main.temp}°C</p>
                        <p>${hour.weather[0].description}</p>
                    </div>
                `;
            });

            // 5-Day Forecast (Filter only daily data at 12:00 PM)
            let dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            dailyData.forEach(day => {
                let date = new Date(day.dt_txt).toDateString();
                let iconCode = day.weather[0].icon;

                forecastHTML += `
                    <div class="forecast-item">
                        <h4>${date}</h4>
                        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">
                        <p>${day.main.temp}°C</p>
                        <p>${day.weather[0].description}</p>
                    </div>
                `;
            });

            document.getElementById("hourly-forecast").innerHTML = hourlyHTML;
            document.getElementById("forecast").innerHTML = forecastHTML;
        })
        .catch(error => console.log("Error fetching forecast data", error));
}

// Function to Change Background Gradient Based on Weather Condition
function changeBackground(condition) {
    const body = document.body;

    const weatherClasses = {
        "Clear": "clear",
        "Clouds": "clouds",
        "Rain": "rain",
        "Snow": "snow",
        "Thunderstorm": "thunderstorm",
        "Drizzle": "drizzle",
        "Mist": "mist"
    };

    // Remove any previous weather class
    body.className = "";
    body.classList.add(weatherClasses[condition] || "default");
}
