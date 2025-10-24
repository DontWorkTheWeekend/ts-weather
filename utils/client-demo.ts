// Demo script showing weather client usage
import { WeatherClient } from '@ts-weather/client';
import type { WeatherData } from '@ts-weather/client';

const DEFAULT_SERVER_URL: string = 'http://localhost:3000';

async function main(): Promise<void> {
  const serverUrl: string = process.env.WEATHER_SERVER_URL ||
    DEFAULT_SERVER_URL;
  const client: WeatherClient = new WeatherClient({
    baseUrl: serverUrl,
    timeout: 5000,
  });

  console.log('Weather Client Demo');
  console.log('===================\n');

  // Check server health
  console.log('Checking server health...');
  const isHealthy: boolean = await client.checkHealth();
  if (!isHealthy) {
    console.error('❌ Server is not responding');
    process.exit(1);
  }
  console.log('✓ Server is healthy\n');

  // Get available locations
  console.log('Fetching available locations...');
  const locations: string[] = await client.getLocations();
  console.log(`✓ Available locations: ${locations.join(', ')}\n`);

  // Get weather for each location
  for (const location of locations) {
    try {
      console.log(`Fetching weather for ${location}...`);
      const weather: WeatherData = await client.getWeather(location);

      console.log(`✓ Weather in ${weather.location}:`);
      console.log(`  Temperature: ${weather.temperature}°C`);
      console.log(`  Condition: ${weather.condition}`);
      console.log(`  Humidity: ${weather.humidity}%`);
      console.log(
        `  Updated: ${new Date(weather.timestamp).toLocaleString()}\n`,
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `❌ Error fetching weather for ${location}: ${error.message}\n`,
        );
      }
    }
  }

  // Test error handling with invalid location
  console.log('Testing error handling with invalid location...');
  try {
    await client.getWeather('invalid-city');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`✓ Error handled correctly: ${error.message}\n`);
    }
  }

  console.log('Demo complete!');
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Fatal error:', error.message);
  }
  process.exit(1);
});
