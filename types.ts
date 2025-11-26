export enum WeatherCondition {
  CLEAR = 'Clear',
  CLOUDS = 'Clouds',
  RAIN = 'Rain',
  STARRY = 'Starry', // Default state
}

export interface CityData {
  name: string;
  district: string;
  pinCode: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  description: string;
  feelsLike: number;
}

export interface PredictionData {
  tomorrowTemp: number;
  tomorrowCondition: WeatherCondition;
  tomorrowRainChance: number;
  summary: string;
  hourlyForecast: { hour: string; temp: number }[];
  tags: string[]; // e.g., ['Sunny', 'High UV']
}

export interface ClimateResponse {
  current: WeatherData;
  prediction: PredictionData;
}