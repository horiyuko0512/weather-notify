import axios from 'axios';
import cron from 'node-cron';

const LOCATION = 'Tsukuba';
const WEATHER_API_KEY = '-----------------';
const LINE_API_KEY = '-----------------';
const TIME_DIFFERENCE = 9;

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

function checkLaundry(forecast) {
  const rainThreshold = 0.3;
  const targetHour = [9, 12, 15];
  const LaundryHours = forecast.filter(entry => {
    const date = new Date(entry.dt * 1000); // Unix timestampをDateオブジェクトに変換
    date.setHours(date.getHours() + TIME_DIFFERENCE);
    const hour = date.getHours();
    const rainPop = entry.pop;
    const weather = entry.weather[0].main.toLowerCase();
    return targetHour.includes(hour) && rainPop <= rainThreshold && !weather.includes('rain');
  });
  return LaundryHours.length === targetHour.length;
}

async function checkWeather() {
  const weatherData = await getWeather();
  if (!weatherData) {
    return;
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(tomorrow.getHours() + TIME_DIFFERENCE);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const tomorrowForecast = weatherData.list.filter(forecast => {
    const forecastDate = new Date(forecast.dt * 1000); // Unix timestampをDateオブジェクトに変換
    forecastDate.setHours(forecastDate.getHours() + TIME_DIFFERENCE);
    return forecastDate.toISOString().split('T')[0] === tomorrowStr;
  });
  if (!tomorrowForecast) {
    console.error('No weather data available for tomorrow');
    return;
  }
  const forecastMessage = tomorrowForecast.map(forecast => {
    const time = new Date(forecast.dt * 1000); // Unix timestampをDateオブジェクトに変換
    const timeStr = time.toTimeString().slice(0, 5);
    const weather = forecast.weather[0].description;
    const temp = forecast.main.temp;
    const pop = Math.round(forecast.pop * 100); //%表示
    return `${timeStr}\n${weather}, ${temp}度, 降水確率${pop}%\n------------------------------`;
  }).join('\n');
  const laundryMessage = checkLaundry(tomorrowForecast) ? '洗濯日和です！' : '洗濯日和ではありません。';
  const message = `${LOCATION}市の明日の天気予報です。\n${forecastMessage}\n\n${laundryMessage}`;
  await sendLineMessage(message);
}

cron.schedule('0 21 * * *', () => {
  checkWeather();
});