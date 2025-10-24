// Weather service using erasable TypeScript type syntax

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  timestamp: string;
}

export interface WeatherQuery {
  location: string;
}

// Mock weather database
const weatherDatabase: Map<string, WeatherData> = new Map([
  ['london', {
    location: 'London',
    temperature: 15,
    condition: 'Cloudy',
    humidity: 75,
    timestamp: new Date().toISOString(),
  }],
  ['paris', {
    location: 'Paris',
    temperature: 18,
    condition: 'Sunny',
    humidity: 60,
    timestamp: new Date().toISOString(),
  }],
  ['tokyo', {
    location: 'Tokyo',
    temperature: 22,
    condition: 'Rainy',
    humidity: 85,
    timestamp: new Date().toISOString(),
  }],
]);

export function getWeather(location: string): WeatherData | null {
  const normalizedLocation: string = location.toLowerCase();
  const weather: WeatherData | undefined = weatherDatabase.get(
    normalizedLocation,
  );

  if (!weather) {
    return null;
  }

  // Return a fresh copy with updated timestamp
  return {
    ...weather,
    timestamp: new Date().toISOString(),
  };
}

export function getAllLocations(): string[] {
  return Array.from(weatherDatabase.keys());
}
