/**
 * @fileoverview Implements a service for interacting with weather data. This
 * abstracts weather interactions from a specific 3rd-party API.
 */

const WeatherApi = require('../integrations/weather-api');
const CacheService = require('./cache-service');

/**
 * How long weather data should be cached for in seconds.
 */
const WEATHER_DATA_TTL = 300; // 5 minutes

/**
 * Cache key prefix to use for current weather data. Should be used as a prefix
 * along with a city name to build the full key.
 */
const CURRENT_WEATHER_CACHE_KEY_PREFIX = 'current-weather:';

class WeatherService {
  /**
   * @constructor
   */
  constructor() {
    // Initialize the API
    this.api = new WeatherApi();

    // Initialize the cache
    this.cache = new CacheService(WEATHER_DATA_TTL);
  }

  /**
   * @function getCurrentWeatherForCity
   * Gets the current weather for the given city.
   * @param {string} city - City for which to get the weather
   * @returns {Promise<object>} Promise for weather data
   */
  async getCurrentWeatherForCity(city) {
    // See if the data is in the cache first
    const key = this.getCurrentWeatherCacheKey(city);
    let weather = this.cache.get(key);

    if (!weather) {
      console.log(`[WeatherService.getCurrentWeatherForCity] Not in cache for "${city}". Fetching from the API`);
      // Not in the cache, so fetch from the API
      const raw = await this.api.getCurrentWeatherForCity(city);
      weather = this.normalize(raw);

      // Then store it in the cache for faster retrieval later
      this.cache.set(key, weather);
    } else {
      console.log(`[WeatherService.getCurrentWeatherForCity] Found in cache for "${city}"`);
    }

    return weather;
  }

  /**
   * @function normalize
   * Normalizes incoming weather data from the API into a format that's more
   * useful to this application.
   * @param {object} data - Weather data object
   */
  normalize(data) {
    // Build the normalized data object
    const normalizedData = {
      /**
       * Alt text for the icon image.
       */
      iconAlt: null,

      /**
       * URL for an icon representing the current weather condition.
       */
      iconUrl: null,

      /**
       * Human-readable summary of the current weather condition.
       */
      summary: null,
    };

    // Grab the current temperature
    const actualTemp = Math.round(Number(data.current.temp_f));
    const feelsLikeTemp = Math.round(Number(data.current.feelslike_f));

    let temp = `${actualTemp.toFixed(0)} ºF`;

    // If it feels like a different temperature than actual, include that too
    if (feelsLikeTemp !== actualTemp) {
      temp += ` (feels like ${feelsLikeTemp.toFixed(0)} ºF)`;
    }

    // Grab the humidity
    const humidityPct = Number(data.current.humidity);
    const humidity = `${humidityPct.toFixed(0)}% humidity`;

    // Grab the current weather condition
    let condition = data.current.condition.text.toLowerCase();

    // Special handling for "mist" so it reads better
    if (condition === "mist") {
      condition = "misty";
    }

    // Grab the location of the current weather
    const location = `${data.location.name}, ${data.location.region}`;

    normalizedData.summary =
      `It's currently ${temp} and ${condition} with ${humidity} in ${location}`;

    // Include the icon URL if available
    if (data.current.condition.icon) {
      normalizedData.iconAlt = condition;
      normalizedData.iconUrl = data.current.condition.icon;
    }

    return normalizedData;
  }

  /**
   * @function getCurrentWeatherCacheKey
   * Builds a cache key for current weather data for the given city.
   * @param {string} city - City for which to build cache key
   * @returns {string} Cache key
   */
  getCurrentWeatherCacheKey = city =>
    `${CURRENT_WEATHER_CACHE_KEY_PREFIX}${city}`;
}

module.exports = WeatherService;
