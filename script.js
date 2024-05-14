async function getWeather() {
    const cityName = document.getElementById('cityInput').value.trim();
    if (cityName === '') {
        alert('Please enter a city name');
        return;
    }

    document.getElementById('autocompleteOptions').innerHTML = '';

    document.getElementById('loadingSpinner').style.display = 'block';

    const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${cityName}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ef135d745bmsh4d10957a62e8ce1p1c1c40jsnf0687137ec5e',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const weatherData = await response.json();
        displayWeather(weatherData);
        document.getElementById('cityInput').value = '';
    } catch (error) {
        console.error(error);
        alert('Failed to fetch weather data');
    } finally {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

function displayWeather(weatherData) {
    const weatherInfoDiv = document.getElementById('weatherInfo');
    weatherInfoDiv.innerHTML = `
      <h2>${weatherData.location.name}, ${weatherData.location.country}</h2>
      <p>Temperatura: ${weatherData.current.temp_c}°C</p>
      <p>Humedad: ${weatherData.current.humidity} %</p>
      <p>Hora: ${weatherData.location.localtime.slice(-5)}</p>
      <img src="${weatherData.current.condition.icon}" alt="Weather Icon">
    `;
    console.log(weatherData);
}

document.getElementById('cityInput').addEventListener('input', async function () {
    const cityName = this.value.trim();
    if (cityName === '') {
        document.getElementById('autocompleteOptions').innerHTML = '';
        return;
    }

    const url = `https://weatherapi-com.p.rapidapi.com/search.json?q=${cityName}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'ef135d745bmsh4d10957a62e8ce1p1c1c40jsnf0687137ec5e',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch autocomplete options');
        }
        const autocompleteData = await response.json();
        renderAutocompleteOptions(autocompleteData);
    } catch (error) {
        console.error(error);
        alert('Failed to fetch autocomplete options');
    }
});

document.getElementById('cityInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});

function renderAutocompleteOptions(autocompleteData) {
    const autocompleteOptionsDiv = document.getElementById('autocompleteOptions');
    autocompleteOptionsDiv.innerHTML = '';
    autocompleteData.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.textContent = option.name;
        optionElement.classList.add('autocomplete-option');
        optionElement.addEventListener('click', function () {
            document.getElementById('cityInput').value = option.name;
            autocompleteOptionsDiv.innerHTML = '';
        });
        autocompleteOptionsDiv.appendChild(optionElement);
    });
}
