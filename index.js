const API_KEY = '1977debf2877a0be6ba449dd01ada2ce';

const resultDOM = document.querySelector('.result')
const address = document.querySelector('.address');
const temperature = document.querySelector('.temperature .value');
const feelsLike = document.querySelector('.feels-like .value');
const wind = document.querySelector('.wind .value');
const humidity = document.querySelector('.humidity .value');
const description = document.querySelector('.weather-description');
const tempUnitDOMs = document.querySelectorAll('.temperature-unit');
const tempUnitSwitchDOM = document.querySelector('.switch input[type=checkbox]');

let tempUnit = 'Celsius';
let searched = false;
// Fahrenheit
let searchResult;

async function makeAPIRequest(city){
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if(!response.ok) throw new Error('Network Problem');
        return await response.json(); 
    }catch(e){
        console.error(e);
    }
}
async function getWeatherByCityName(city){
    try {
        const data = await makeAPIRequest(city);
        // Make description sentence case
        const desc = data.weather[0].description
                    .split(' ')
                    .map(word => {
                        word = word[0].toUpperCase() + word.slice(1);
                        return word;
                    })
                    .join(' ');

        return {
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            description: desc
        }
    }catch(e){
        console.error(e);
    }
}

function displaySearchResult(result){
    resultDOM.classList.remove('hidden');
    address.textContent = `${result.city}, ${result.country}`;
    temperature.textContent = result.temperature;
    feelsLike.textContent = result.feelsLike;
    wind.textContent = result.wind;
    humidity.textContent = result.humidity;
    description.textContent = result.description;
}
async function searchCity(event, location){
    const city = location.value;
    if(event.key !== 'Enter') return;
    // const searchResult = getWeatherByCityName(city).then((res) => console.log(res));
    searchResult =  await getWeatherByCityName(city);
    searched = true;
    displaySearchResult(searchResult);
    location.value = '';

}

function convertCtoF(celsius){
    return ((celsius*9/5)+32).toFixed(2);
}

function convertFtoC(fahrenheit){
    return ((fahrenheit - 32)*5/9).toFixed(2);
}

function switchUnit(isChecked){
    if(!searched) return;
    let html;
    if(isChecked){
        html = `
        <sup>o</sup>
        F
        `;
        searchResult.temperature = convertCtoF(searchResult.temperature);
        searchResult.feelsLike = convertCtoF(searchResult.feelsLike);

    }else {
        html = `
        <sup>o</sup>
        C
        `;
        searchResult.temperature = convertFtoC(searchResult.temperature);
        searchResult.feelsLike = convertFtoC(searchResult.feelsLike);
    }
    // Display result with new unit
    displaySearchResult(searchResult);
    // Change unit symbol
    tempUnitDOMs.forEach((el) => el.innerHTML = html);
}
function init(){
    const location = document.querySelector('#city');


    location.addEventListener('keydown', (event) => {
        searchCity(event, location)
    });

    tempUnitSwitchDOM.addEventListener('click', (event) => {
        switchUnit(event.target.checked);

    })
}

init();