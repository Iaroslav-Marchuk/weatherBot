import axios from 'axios';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { find } from 'geo-tz';

export async function getCityData(city) {
  const { data } = await axios.get(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      params: {
        q: city,
        appid: getEnvVariable('WEATHER_API_KEY'),
        units: 'metric',
        lang: 'ua',
      },
    },
  );

  const timezone = find(data.coord.lat, data.coord.lon)[0];

  return {
    name: data.name,
    timezone,
  };
}

export async function getWeather(city) {
  const { data } = await axios.get(
    'https://api.openweathermap.org/data/2.5/weather',
    {
      params: {
        q: city,
        appid: getEnvVariable('WEATHER_API_KEY'),
        units: 'metric',
        lang: 'ua',
      },
    },
  );

  return `📍 ${data.name}\n🌡 ${data.main.temp}°C\n🌤 ${data.weather[0].description}`;
}

export async function getForecast(city) {
  const { data } = await axios.get(
    'https://api.openweathermap.org/data/2.5/forecast',
    {
      params: {
        q: city,
        appid: getEnvVariable('WEATHER_API_KEY'),
        units: 'metric',
        lang: 'ua',
        cnt: 40,
      },
    },
  );

  const daily = data.list.filter((item) => item.dt_txt.includes('12:00:00'));

  return daily
    .map((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('uk-UA', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      return `📅 ${date}: ${item.main.temp}°C, ${item.weather[0].description}`;
    })
    .join('\n');
}
