import fetch from 'node-fetch';
import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

app.post('/weather', async (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${req.body.lat}&lon=${req.body.lng}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    try {
        let api_response = await fetch(url);
        let weatherData = await api_response.json();
        res.json(weatherData.main.temp);
    } catch (error) {
        console.log(error);
        res.json(404)
    }
})

app.get('/cities_countries', async (req, res) => {
    const citiesURL = 'http://techslides.com/demos/country-capitals.json';
    const response = await fetch(citiesURL);
    const obj = await response.json();
    res.json(obj);
})

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})