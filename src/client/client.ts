// Weather client using erasable TypeScript type syntax

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  timestamp: string;
}

export interface WeatherClientConfig {
  baseUrl: string;
  timeout?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class WeatherClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: WeatherClientConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout ?? 5000;
  }

  async getWeather(location: string): Promise<WeatherData> {
    const url: string = `${this.baseUrl}/weather?location=${
      encodeURIComponent(location)
    }`;

    const controller: AbortController = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeout,
    );

    try {
      const response: Response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<WeatherData> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch weather data');
      }

      return result.data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch weather: ${error.message}`);
      }
      throw error;
    }
  }

  async getLocations(): Promise<string[]> {
    const url: string = `${this.baseUrl}/locations`;

    const controller: AbortController = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.timeout,
    );

    try {
      const response: Response = await fetch(url, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<string[]> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch locations');
      }

      return result.data;
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch locations: ${error.message}`);
      }
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    const url: string = `${this.baseUrl}/health`;

    try {
      const response: Response = await fetch(url);
      const result: ApiResponse<string[]> = await response.json();
      return result.success;
    } catch {
      return false;
    }
  }
}
