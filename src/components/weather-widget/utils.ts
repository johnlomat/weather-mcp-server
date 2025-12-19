// Weather widget utility functions

export const getWeatherEmoji = (code: number): string => {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 49) return '🌫️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '🌨️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

export const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 49) return 'Foggy'
  if (code <= 69) return 'Rainy'
  if (code <= 79) return 'Snowy'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}
