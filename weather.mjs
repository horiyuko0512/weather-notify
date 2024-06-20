import axios from 'axios';
import cron from 'node-cron';

const LOCATION = 'Tsukuba';
const WEATHER_API_KEY = '-----------------';
const LINE_API_KEY = '-----------------';

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

async function sendLineMessage(message) {
  try {
    await axios.post('https://notify-api.line.me/api/notify', null, {
      headers:{
        Authorization: `Bearer ${LINE_API_KEY}` 
      },
      params: {
        message
      }
    });
  } catch (error) {
    console.error('Error sending LINE message:', error);
  }
}

async function checkWeather() {
  const weatherData = await getWeather();
  if (!weatherData) {
    return;
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const tomorrowForecast = weatherData.list.filter(forecast => forecast.dt_txt.startsWith(tomorrowStr));
  if (!tomorrowForecast) {
    console.error('No weather data available for tomorrow');
    return;
  }
  const forecastMessage = tomorrowForecast.map(forecast => {
    const time = forecast.dt_txt.split(' ')[1];
    const weather = forecast.weather[0].description;
    const temp = forecast.main.temp;
    return `${time}: ${weather}, ${temp}度`;
  }).join('\n');
  const message = `${LOCATION}市の明日の天気予報です。\n${forecastMessage}`;
  await sendLineMessage(message);  
}

checkWeather();