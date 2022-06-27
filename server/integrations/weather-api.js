/**
 * @fileoverview Implements an integration with the Weather API.
 * https://www.weatherapi.com/
 */

const fetch = require('node-fetch');

const ROOT_URL = 'http://api.weatherapi.com/v1/';
const CURRENT_RESOURCE = 'current.json';

class WeatherApi {
  async getCurrentWeatherForCity(city) {
    // Build URL for the current weather resource
    let url = this.getUrl(CURRENT_RESOURCE);

    // Build query parameters
    const params = new URLSearchParams();
    params.append('key', process.env.WEATHER_API_KEY);
    params.append('q', city);

    url += '?' + params.toString();

    const response = await fetch(url, { method: 'GET' });

    // First check the response status code
    if (response.status === 200) {
      // 200 OK, so grab the data
      let json = null;

      try {
        json = await response.json();
      } catch (e) {
        console.error(`Error occurred while parsing API response for ${url}: `, e);
        return;
      }

      return json;
    } else if (response.status === 400) {
      // 400 Bad Request
      const text = await response.text();
      console.error(`Bad request for ${url}: ${text}`);
      return;
    } else if (response.status === 401) {
      // 401 Unauthorized
      const text = await response.text();
      console.error(`Unauthorized for ${url}: ${text}`);
      return;
    } else if (response.status === 403) {
      // 403 Forbidden
      const text = await response.text();
      console.error(`Forbidden for ${url}: ${text}`);
      return;
    }
  }

  /**
   * @function getUrl
   * Helper function to build an API URL for the given resource and optional
   * record ID.
   * @param {string} resource - API resource to access
   * @returns {string} Constructed API URL
   */
  getUrl = (resource) => `${ROOT_URL}${resource}`;
}

module.exports = WeatherApi;
