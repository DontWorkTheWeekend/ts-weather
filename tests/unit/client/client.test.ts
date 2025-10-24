// Unit tests for weather client
import { assertEquals, assertRejects } from '@std/assert';
import { WeatherClient } from '@ts-weather/client';

Deno.test('WeatherClient - constructor', () => {
  const client = new WeatherClient({
    baseUrl: 'http://example.com',
    timeout: 3000,
  });

  assertEquals(client instanceof WeatherClient, true);
});

Deno.test('WeatherClient - handles fetch errors gracefully', async () => {
  const client = new WeatherClient({
    baseUrl: 'http://invalid-domain-that-does-not-exist-12345.com',
    timeout: 1000,
  });

  await assertRejects(
    async () => {
      await client.getWeather('london');
    },
    Error,
    'Failed to fetch weather',
  );
});

Deno.test('WeatherClient - handles timeout', async () => {
  const client = new WeatherClient({
    baseUrl: 'http://localhost:9999', // Non-existent server
    timeout: 100, // Very short timeout
  });

  await assertRejects(
    async () => {
      await client.getLocations();
    },
    Error,
  );
});
