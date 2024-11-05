import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
  name: string;
  state: string;
}


// TODO: Define a class for the Weather object
class Weather {
  name: string;
  date: string;
  icon: string;
  temperature: number;
  humidity: number;
  windspeed: number;

  constructor(name: string, date: string, icon: string, temperature: number, humidity: number, windspeed: number) {
    this.name = name;
    this.date = date;
    this.icon = icon;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windspeed = windspeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.WEATHER_API_BASE_URL || '';
  private apiKey: string = process.env.WEATHER_API_KEY || '';
  private cityName: string = '';
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string) {
    const response: Coordinates[] = await fetch(query).then((res) => res.json());
    return response[0];
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon, name, state } = locationData;
    const coordinates = { lat, lon, name, state };
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}

  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any) {
    return new Weather(
      response.name,
      response.dt,
      response.weather[0].icon,
      response.main.temp,
      response.main.humidity,
      response.wind.speed
    );
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [currentWeather];
    for (let i = 0; i < weatherData.length; i++) {
      const forecast = new Weather(
        currentWeather.name,
        weatherData[i].dt,
        weatherData[i].weather[0].icon,
        weatherData[i].main.temp,
        weatherData[i].main.humidity,
        weatherData[i].wind.speed
      );
      forecastArray.push(forecast);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const currentWeather = this.parseCurrentWeather(await this.fetchWeatherData(coordinates));
    const weatherData = await this.fetchWeatherData(coordinates);
    return this.buildForecastArray(currentWeather, weatherData);
  }
}

export default new WeatherService();