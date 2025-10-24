// Weather server using Node.js erasable TypeScript types
import { createServer } from 'node:http';
import { getAllLocations, getWeather } from './weather.ts';
import type { WeatherData } from './weather.ts';

const PORT: number = 3000;
const HOST: string = 'localhost';

interface ServerResponse {
  success: boolean;
  data?: WeatherData | string[];
  error?: string;
}

const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    const response: ServerResponse = {
      success: false,
      error: 'Method not allowed',
    };
    res.writeHead(405);
    res.end(JSON.stringify(response));
    return;
  }

  const url: URL = new URL(req.url!, `http://${req.headers.host}`);
  const pathname: string = url.pathname;

  if (pathname === '/health') {
    const response: ServerResponse = {
      success: true,
      data: ['Server is running'],
    };
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }

  if (pathname === '/locations') {
    const locations: string[] = getAllLocations();
    const response: ServerResponse = {
      success: true,
      data: locations,
    };
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }

  if (pathname === '/weather') {
    const location: string | null = url.searchParams.get('location');

    if (!location) {
      const response: ServerResponse = {
        success: false,
        error: 'Location parameter is required',
      };
      res.writeHead(400);
      res.end(JSON.stringify(response));
      return;
    }

    const weather: WeatherData | null = getWeather(location);

    if (!weather) {
      const response: ServerResponse = {
        success: false,
        error: `Weather data not found for location: ${location}`,
      };
      res.writeHead(404);
      res.end(JSON.stringify(response));
      return;
    }

    const response: ServerResponse = {
      success: true,
      data: weather,
    };
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }

  const response: ServerResponse = {
    success: false,
    error: 'Not found',
  };
  res.writeHead(404);
  res.end(JSON.stringify(response));
});

server.listen(PORT, HOST, () => {
  console.log(`Weather server running at http://${HOST}:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET /health - Health check`);
  console.log(`  GET /locations - List available locations`);
  console.log(`  GET /weather?location=<name> - Get weather for location`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { server };
