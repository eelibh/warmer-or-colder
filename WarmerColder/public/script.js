const higher_div = document.getElementById("higher");
const lower_div = document.getElementById("lower");
const firstCity_span = document.getElementById('first-city');
const secondCity_span = document.getElementById('second-city');
const aCityExample_span = document.getElementById('aCityExample');
const aCityTemp_span = document.querySelector('.temp');
const userScore_pg = document.querySelector('.score');
const playAgainBtn_div = document.getElementById("play-again");
const WORLD_BOUNDS = {
    north: 84.69281715794585,
    south: -82.27332680131032,
    west: -200.11679680170144,
    east: 200.42446072123158
};
let markers = [];
let COUNTRY_CITY_DATA;
let userScore = 0;
let firstCity;
let secondCity;
let firstCityWeather;
let secondCityWeather;
randomizeCityCountryPairs();

higher_div.addEventListener('click', function () {
    higher_div.disabled = true;
    setTimeout(function () {
        higher_div.disabled = false;
    }, 2000);
    checkUserAnswer(1);
})

lower_div.addEventListener('click', function () {
    lower_div.disabled = true;
    setTimeout(function () {
        lower_div.disabled = false;
    }, 2000);
    checkUserAnswer(0);
})

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 20, lng: 0 },
        zoom: 3,
        minZoom: 3,
        maxZoom: 15,
        mapId: '71b5fe6a8ae336ee',
        disableDefaultUI: true,
        backgroundColor: "none",
        /*  gestureHandling: "none",
         zoomControl: false, */
        restriction: {
            latLngBounds: WORLD_BOUNDS,
            strictBounds: false,
        }
    });
}

async function updateMap() {
    deleteMarkers();
    let firstLocation = {
        lat: parseFloat(firstCity.CapitalLatitude),
        lng: parseFloat(firstCity.CapitalLongitude)
    }
    let secondLocation = {
        lat: parseFloat(secondCity.CapitalLatitude),
        lng: parseFloat(secondCity.CapitalLongitude)
    }
    const marker = new google.maps.Marker({
        position: firstLocation,
        animation: google.maps.Animation.BOUNCE,
        title: firstCity.CapitalName,
        map: map,
    });
    const markerTwo = new google.maps.Marker({
        position: secondLocation,
        animation: google.maps.Animation.BOUNCE,
        title: secondCity.CapitalName,
        map: map,
    });
    markers.push(marker);
    markers.push(markerTwo);
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function hideMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    hideMarkers();
    markers = [];
}

async function randomizeCityCountryPairs() {
    if (userScore == 0) {
        COUNTRY_CITY_DATA = await getCitiesAndCountries();
        firstCity = COUNTRY_CITY_DATA[Math.floor(Math.random() * COUNTRY_CITY_DATA.length)];
        secondCity = COUNTRY_CITY_DATA[Math.floor(Math.random() * COUNTRY_CITY_DATA.length)];

        // DATA INCLUDES CAPITAL CITIES DEFINES AS 'N/A' - DOES NOT WORK
        while (firstCity.CapitalName === "N/A" || secondCity.CapitalName === "N/A") {
            firstCity = COUNTRY_CITY_DATA[Math.floor(Math.random() * COUNTRY_CITY_DATA.length)];
            secondCity = COUNTRY_CITY_DATA[Math.floor(Math.random() * COUNTRY_CITY_DATA.length)];
        }
    } else {
        firstCity = secondCity;
        secondCity = COUNTRY_CITY_DATA[Math.floor(Math.random() * COUNTRY_CITY_DATA.length)];
    }
    await getCityWeathers();
    updateDataToEndUser();
    updateMap();
}

async function getCitiesAndCountries() {
    let response = await fetch('/cities_countries');
    let citiesCountriesData = await response.json();
    return citiesCountriesData;
}

async function getCityWeathers() {
    firstCityWeather = await getWeatherData(firstCity.CapitalLatitude, firstCity.CapitalLongitude);
    secondCityWeather = await getWeatherData(secondCity.CapitalLatitude, secondCity.CapitalLongitude);
}

async function getWeatherData(lat, lng) {
    let response = await fetch('/weather', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            lat: lat,
            lng: lng,
        })
    })
    let weathers = await response.json();
    if (weathers === 404) {
        alert("Error in getting city weather, sorry about that! | Loading new cities");
        randomizeCityCountryPairs();
    }
    else return weathers;
}

async function checkUserAnswer(userAnswer) {
    if (firstCityWeather > secondCityWeather)
        correctAnswer = 1;
    else correctAnswer = 0;
    if (userAnswer === correctAnswer) {
        userScore += 1;
        userScore_pg.innerHTML = userScore;
        gameContinues();
    } else gameEnded();
}

function updateDataToEndUser() {
    userScore_pg.innerHTML = userScore;
    firstCity_span.innerHTML = firstCity.CapitalName;
    secondCity_span.innerHTML = secondCity.CapitalName;
    aCityExample_span.innerHTML = firstCity.CapitalName;
    aCityTemp_span.innerHTML = firstCityWeather;
}

function gameContinues() {
    randomizeCityCountryPairs();
}

function gameEnded() {
    document.getElementById("game-over-1").classList.toggle("active");
}

playAgainBtn_div.addEventListener('click', function () {
    console.log("clicked");
    document.location.reload();
});

document.onload = function () {
    setTimeout(function () {
        document.querySelector(".main-container").classList.toggle("loaded");
    }, 700);
    document.getElementById("map").classList.toggle("loaded");
}

document.onload();
