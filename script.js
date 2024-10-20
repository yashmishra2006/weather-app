window.addEventListener('load', () => {
  const baseURL = 'https://openweathermap.org/img/wn/';
  let long;
  let lat;
  let temperatureDescription = document.querySelector('.temperature-description');
  let temperatureDegree = document.querySelector('.temperature-value');
  let locationTimezone = document.querySelector('.location');
  let weatherIcon = document.querySelector('.weather-icon');
  let text = document.querySelector('.text');
  let searchBox = document.querySelector('.search-bar');
  const themeToggle = document.getElementById('theme-toggle');
  const weatherBox = document.querySelector('.weather-box');

  // Check if the user has a saved theme preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    weatherBox.classList.add(savedTheme);
    temperatureDegree.classList.add(savedTheme);
    themeToggle.checked = savedTheme === 'dark';
  }

  // Add event listener for the toggle switch
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('dark');
      weatherBox.classList.add('dark');
      temperatureDegree.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Save theme preference
    } else {
      document.body.classList.remove('dark');
      weatherBox.classList.remove('dark');
      temperatureDegree.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Save theme preference
    }
  });

  function fetchWeather(api) {
    fetch(api)
      .then((response) => response.json())
      .then((data) => {
        if (parseInt(data.cod) > 400) {
          text.textContent = capitalizeFirstLetter(data.message);
          temperatureDegree.textContent = '';
          temperatureDescription.textContent = '';
          locationTimezone.textContent = '';
          weatherIcon.innerHTML = '';
          return;
        }
        const { temp } = data.main;
        const { description, icon } = data.weather[0];
        const { name } = data;
        const { country } = data.sys;

        temperatureDegree.textContent = temp + '°C';
        temperatureDescription.textContent = capitalizeFirstLetter(description);
        locationTimezone.textContent = `${capitalizeFirstLetter(name)}, ${capitalizeFirstLetter(country)}`;

        weatherIcon.innerHTML = `<img src="${baseURL}${icon}@2x.png" alt="">`;

        const favicon = document.querySelector('link[rel="icon"]');
        favicon.href = `${baseURL}${icon}@2x.png`;

        text.textContent = '';
      });
  }

  searchBox.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
      const api = `https://api.openweathermap.org/data/2.5/weather?q=${searchBox.value}&appid=a5f698de4c2ff45712e1276495f3213e&units=metric`;
      fetchWeather(api);
      searchBox.value = '';
    }
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=a5f698de4c2ff45712e1276495f3213e&units=metric`;
      fetchWeather(api);
    });
  } else {
    text.textContent = 'Please enable location access to your browser.';
  }
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
