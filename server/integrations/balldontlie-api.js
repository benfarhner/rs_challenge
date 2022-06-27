/**
 * @fileoverview Implements an integration with the balldontlie API.
 * https://www.balldontlie.io/
 * - No API key required.
 * - Rate limit of 60 requests per minute.
 */

const fetch = require('node-fetch');

const ROOT_URL = 'https://www.balldontlie.io/api/v1/';
const TEAMS_RESOURCE = 'teams';

class BalldontlieApi {
  /**
   * @function getAllTeams
   * Retrieves a list of all NBA teams for the current season from the API.
   * @returns {Promise<Array<object>>} Promise for a list of NBA team objects
   */
  async getAllTeams() {
    // Build the URL to the resource
    let url = this.getUrl(TEAMS_RESOURCE);
    const teams = await this.getPaginatedResults(url, 30);

    return teams;
  }

  /**
   * @function getTeam
   * Retrieves the NBA team with the given ID from the API.
   * @param {number} id - Team ID
   * @returns {Promise<object>} Promise for an NBA team object
   */
  async getTeam(id) {
    // Build the URL to the resource
    let url = this.getUrl(TEAMS_RESOURCE, id);
    const team = await this.getResult(url);

    return team;
  }

  /**
   * @function getResult
   * Helper function to GET an API resource, and handle error responses, etc.
   * @param {string} url - URL to the API resource
   * @returns {Promise<object>} Promise for a result
   */
  async getResult(url) {
    let result = null;

    // Fetch the data from the API
    const response = await fetch(url, { method: 'GET' });

    // First check the response status code
    if (response.status === 200) {
      // 200 OK, so grab the data
      try {
        result = await response.json();
      } catch (e) {
        console.error(`Error occurred while parsing API response for ${url}: `, e);
        return;
      }
    } else if (response.status === 400) {
      // 400 Bad Request
      console.error(`Bad request for ${url}`);
      return;
    } else if (response.status === 404) {
      // 404 Not Found
      console.error(`Resource ${url} not found`);
      return;
    } else if (response.status === 406) {
      // 406 Not Acceptable
      console.error(`Not acceptable for ${url}`);
      return;
    } else if (response.status === 429) {
      // 429 Too Many Requests
      // Delay for 1 second, per rate limit, and resend
      await new Promise(r => setTimeout(r, 1000));
      result = this.getResult(url);
    } else if (response.status === 500) {
      // 500 Internal Server Error
      console.error(`Internal server error for ${url}`);
      return;
    } else if (response.status === 503) {
      // 503 Service Unavailable
      console.error(`Service unavailable for ${url}`);
      return;
    }

    return result;
  }

  /**
   * @function getPaginatedResults
   * Helper function to GET an API resource, and handle error responses,
   * pagination, etc.
   * @param {string} url - URL to the API resource
   * @param {number} perPage - Number of records to fetch per page
   * @returns {Promise<Array<object>>} Promise for a list of results
   */
  async getPaginatedResults(url, perPage) {
    // Next page of records being fetched from the API, starting at the first
    // page
    let nextPage = 0;

    // List of data retrieved from the API
    let results = [];

    do {
      // Define the query parameters for this fetch
      const params = new URLSearchParams();
      params.append('page', nextPage);
      params.append('per_page', perPage);
      const fullUrl = `${url}?${params.toString()}`;

      // Fetch the data from the API
      const response = await fetch(fullUrl, { method: 'GET' });

      // First check the response status code
      if (response.status === 200) {
        // 200 OK, so grab the data
        let json = null;

        try {
          json = await response.json();
        } catch (e) {
          console.error(`Error occurred while parsing API response for ${fullUrl}: `, e);
          return;
        }

        // Add the data to the results
        results.push(...json.data);

        // See if there's more data to fetch
        nextPage = json.meta.next_page;
      } else if (response.status === 400) {
        // 400 Bad Request
        console.error(`Bad request for ${fullUrl}`);
        return;
      } else if (response.status === 404) {
        // 404 Not Found
        console.error(`Resource ${fullUrl} not found`);
        return;
      } else if (response.status === 406) {
        // 406 Not Acceptable
        console.error(`Not acceptable for ${fullUrl}`);
        return;
      } else if (response.status === 429) {
        // 429 Too Many Requests
        // Delay for 1 second, per rate limit, and resend
        await new Promise(r => setTimeout(r, 1000));
      } else if (response.status === 500) {
        // 500 Internal Server Error
        console.error(`Internal server error for ${fullUrl}`);
        return;
      } else if (response.status === 503) {
        // 503 Service Unavailable
        console.error(`Service unavailable for ${fullUrl}`);
        return;
      }
    } while (nextPage != null);

    return results;
  }

  /**
   * @function getUrl
   * Helper function to build an API URL for the given resource and optional
   * record ID.
   * @param {string} resource - API resource to access
   * @param {string} [id] - Optional ID of a specific resource
   * @returns {string} Constructed API URL
   */
  getUrl(resource, id) {
    let url = `${ROOT_URL}${resource}`;

    if (id) {
      url += `/${String(id)}`;
    }

    return url;
  }
}

module.exports = BalldontlieApi;
