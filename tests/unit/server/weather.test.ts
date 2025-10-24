// Unit tests for weather service
import { assertEquals, assertExists } from '@std/assert';
import { getAllLocations, getWeather } from '@ts-weather/server';

Deno.test('getWeather - returns weather for valid location', () => {
  const weather = getWeather('london');

  assertExists(weather);
  assertEquals(weather.location, 'London');
  assertEquals(typeof weather.temperature, 'number');
  assertEquals(typeof weather.condition, 'string');
  assertEquals(typeof weather.humidity, 'number');
  assertExists(weather.timestamp);
});

Deno.test('getWeather - is case insensitive', () => {
  const weather1 = getWeather('LONDON');
  const weather2 = getWeather('london');
  const weather3 = getWeather('London');

  assertEquals(weather1?.location, weather2?.location);
  assertEquals(weather2?.location, weather3?.location);
});

Deno.test('getWeather - returns null for invalid location', () => {
  const weather = getWeather('invalid-city-name');
  assertEquals(weather, null);
});

Deno.test('getAllLocations - returns array of location keys', () => {
  const locations = getAllLocations();

  assertEquals(Array.isArray(locations), true);
  assertEquals(locations.length > 0, true);
  assertEquals(locations.includes('london'), true);
  assertEquals(locations.includes('paris'), true);
  assertEquals(locations.includes('tokyo'), true);
});

Deno.test('getWeather - returns fresh timestamp on each call', () => {
  const weather1 = getWeather('london');

  // Small delay
  const start = Date.now();
  while (Date.now() - start < 10) {
    // Wait
  }

  const weather2 = getWeather('london');

  assertExists(weather1);
  assertExists(weather2);

  // Timestamps should be different
  assertEquals(weather1.timestamp !== weather2.timestamp, true);
});
