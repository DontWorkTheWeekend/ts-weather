// Integration tests using Deno to test Node.js TypeScript modules
import { assertEquals, assertExists } from '@std/assert';
import { WeatherClient } from '@ts-weather/client';
import type { WeatherData } from '@ts-weather/client';

const SERVER_URL: string = 'http://localhost:3000';
const SERVER_STARTUP_DELAY: number = 2000;

let serverProcess: Deno.ChildProcess | null = null;

async function startServer(): Promise<void> {
  console.log('Starting weather server...');

  const command = new Deno.Command('node', {
    args: [
      '../../src/server/index.ts',
    ],
    stdout: 'piped',
    stderr: 'piped',
  });

  serverProcess = command.spawn();

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, SERVER_STARTUP_DELAY));

  // Verify server is running
  const client: WeatherClient = new WeatherClient({ baseUrl: SERVER_URL });
  const isHealthy: boolean = await client.checkHealth();

  if (!isHealthy) {
    throw new Error('Server failed to start');
  }

  console.log('✓ Server started successfully\n');
}

async function stopServer(): Promise<void> {
  if (serverProcess) {
    console.log('\nStopping weather server...');
    serverProcess.kill('SIGTERM');
    await serverProcess.status;
    serverProcess = null;
    console.log('✓ Server stopped');
  }
}

// Setup and teardown
Deno.test({
  name: 'Server lifecycle',
  fn: async (t) => {
    await startServer();

    try {
      await t.step('Health check', async () => {
        const client: WeatherClient = new WeatherClient({
          baseUrl: SERVER_URL,
        });

        const isHealthy: boolean = await client.checkHealth();
        assertEquals(isHealthy, true, 'Server should be healthy');
      });

      await t.step('Get available locations', async () => {
        const client: WeatherClient = new WeatherClient({
          baseUrl: SERVER_URL,
        });

        const locations: string[] = await client.getLocations();

        assertExists(locations, 'Locations should exist');
        assertEquals(
          Array.isArray(locations),
          true,
          'Locations should be an array',
        );
        assertEquals(
          locations.length > 0,
          true,
          'Should have at least one location',
        );

        console.log(
          `  Found ${locations.length} locations: ${locations.join(', ')}`,
        );
      });

      await t.step('Get weather for London', async () => {
        const client: WeatherClient = new WeatherClient({
          baseUrl: SERVER_URL,
        });

        const weather: WeatherData = await client.getWeather('london');

        assertExists(weather, 'Weather data should exist');
        assertEquals(weather.location, 'London', 'Location should be London');
        assertEquals(
          typeof weather.temperature,
          'number',
          'Temperature should be a number',
        );
        assertEquals(
          typeof weather.condition,
          'string',
          'Condition should be a string',
        );
        assertEquals(
          typeof weather.humidity,
          'number',
          'Humidity should be a number',
        );
        assertExists(weather.timestamp, 'Timestamp should exist');

        console.log(`  Temperature: ${weather.temperature}°C`);
        console.log(`  Condition: ${weather.condition}`);
        console.log(`  Humidity: ${weather.humidity}%`);
      });

      await t.step('Get weather for all locations', async () => {
        const client: WeatherClient = new WeatherClient({
          baseUrl: SERVER_URL,
        });

        const locations: string[] = await client.getLocations();

        for (const location of locations) {
          const weather: WeatherData = await client.getWeather(location);

          assertExists(weather, `Weather data should exist for ${location}`);
          assertEquals(
            typeof weather.temperature,
            'number',
            `Temperature should be a number for ${location}`,
          );

          console.log(
            `  ${location}: ${weather.temperature}°C, ${weather.condition}`,
          );
        }
      });

      await t.step('Handle invalid location', async () => {
        const client: WeatherClient = new WeatherClient({
          baseUrl: SERVER_URL,
        });

        let errorThrown: boolean = false;
        let errorMessage: string = '';

        try {
          await client.getWeather('invalid-city-name');
        } catch (error: unknown) {
          errorThrown = true;
          if (error instanceof Error) {
            errorMessage = error.message;
          }
        }

        assertEquals(
          errorThrown,
          true,
          'Should throw error for invalid location',
        );
        assertEquals(
          errorMessage.includes('not found') || errorMessage.includes('Failed'),
          true,
          'Error message should indicate location not found',
        );

        console.log(`  ✓ Error handled correctly: ${errorMessage}`);
      });

      await t.step('Test timeout handling', async () => {
        const client: WeatherClient = new WeatherClient({
          baseUrl: SERVER_URL,
          timeout: 50, // Very short timeout
        });

        // This should work because local server is fast
        const weather: WeatherData = await client.getWeather('london');
        assertExists(
          weather,
          'Should get weather data even with short timeout for local server',
        );

        console.log('  ✓ Timeout handling configured correctly');
      });

      await t.step('Test case-insensitive location matching', async () => {
        const client: WeatherClient = new WeatherClient({
          baseUrl: SERVER_URL,
        });

        const weather1: WeatherData = await client.getWeather('LONDON');
        const weather2: WeatherData = await client.getWeather('london');
        const weather3: WeatherData = await client.getWeather('London');

        assertEquals(
          weather1.location,
          weather2.location,
          'Case should not matter',
        );
        assertEquals(
          weather2.location,
          weather3.location,
          'Case should not matter',
        );

        console.log('  ✓ Case-insensitive matching works');
      });
    } finally {
      await stopServer();
    }
  },
  sanitizeOps: false,
  sanitizeResources: false,
});
