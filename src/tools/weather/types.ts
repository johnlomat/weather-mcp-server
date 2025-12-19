// Weather types

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  uvIndex: number;
}

export interface GeocodingResult {
  lat: number;
  lon: number;
  name: string;
}
