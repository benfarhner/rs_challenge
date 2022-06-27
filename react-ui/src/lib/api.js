/**
 * @fileoverview Implements a wrapper class for making API calls.
 */

const ROOT_URL = 'http://localhost:5000/api/';

export default class Api {
  /**
   * @function getNbaTeams
   * Gets the NBA teams for the current season.
   * @returns {Promise<object>} Promise for NBA team data
   */
  getNbaTeams() {
    const url = `${ROOT_URL}nba/teams`;
    return fetch(url).then(response => response.json());
  }

  /**
   * @function getCurrentWeatherForTeam
   * Gets the current weather for the given NBA team.
   * @param {number} id - NBA team ID for which to get current weather
   * @returns {Promise<object>} Promise for weather data
   */
  async getCurrentWeatherForTeam(id) {
    let url = `${ROOT_URL}weather/currentForNbaTeam`;
    const params = new URLSearchParams();
    params.append('id', id);
    url += '?' + params.toString();
    return fetch(url).then(response => response.json());
  }

  /**
   * @function getCurrentWeatherForCity
   * Gets the current weather for the given city.
   * @param {string} city - City for which to get current weather
   * @returns {Promise<object>} Promise for weather data
   */
  async getCurrentWeatherForCity(city) {
    let url = `${ROOT_URL}weather/current`;
    const params = new URLSearchParams();
    params.append('city', city);
    url += '?' + params.toString();
    return fetch(url).then(response => response.json());
  }
}
