// Get coordinates from city name using Open-Meteo Geocoding API

import { GeocodingResult } from "../types";

export async function getCoordinates(city: string): Promise<GeocodingResult> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }
  const result = data.results[0];
  return {
    lat: result.latitude,
    lon: result.longitude,
    name: `${result.name}, ${result.country}`,
  };
}
