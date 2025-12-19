// Fetch weather data using Open-Meteo API

import { WeatherData } from "../types";
import { getCoordinates } from "./get-coordinates";

export async function fetchWeather(city: string): Promise<WeatherData> {
  const coords = await getCoordinates(city);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index`
  );
  const data = await response.json();
  return {
    location: coords.name,
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    uvIndex: data.current.uv_index,
  };
}
