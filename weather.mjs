import axios from 'axios';
import cron from 'node-cron';
import { writeFileSync } from 'fs';

const LOCATION = 'Tsukuba';
const WEATHER_API_KEY = '-------------';
const LINE_API_KEY = 'line_key';

async function getWeather() {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: LOCATION,
        appid: WEATHER_API_KEY,
        units: 'metric',
        lang: 'ja'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

getWeather().then(data => console.log(data));