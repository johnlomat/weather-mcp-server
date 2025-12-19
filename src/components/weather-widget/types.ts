// Weather widget types

export interface WeatherData {
  location?: string
  temperature?: number
  humidity?: number
  windSpeed?: number
  feelsLike?: number
  uvIndex?: number
  weatherCode?: number
}

export interface WeatherWidgetProps {
  data: WeatherData
}
