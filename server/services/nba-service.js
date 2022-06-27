/**
 * @fileoverview Implements a service for interacting with NBA data. This
 * abstracts NBA interactions from a specific 3rd-party API.
 */

const BalldontlieApi = require('../integrations/balldontlie-api');
const CacheService = require('./cache-service');

/**
 * How long NBA data should be cached for in seconds.
 */
const NBA_DATA_TTL = 86400; // 24 hours

/**
 * Cache key to use for NBA team data.
 */
const TEAMS_CACHE_KEY = 'teams';

/**
 * Cache key prefix to use for an individual team's data.
 */
const TEAM_CACHE_KEY_PREFIX = 'team:';

class NbaService {
  /**
   * @constructor
   */
  constructor() {
    // Initialize the API
    this.api = new BalldontlieApi();

    // Initialize the cache
    this.cache = new CacheService(NBA_DATA_TTL);
  }

  /**
   * @function getAllTeams
   * Retrieves a list of all NBA teams in the current season
   * @returns {Promise<Array<object>>} Promise for a list of teams
   */
  async getAllTeams() {
    // See if the data is in the cache first
    let teams = this.cache.get(TEAMS_CACHE_KEY);

    if (!teams) {
      console.log('[NbaService.getAllTeams] Not in cache. Fetching from the API');
      // Not in the cache, so fetch from the API
      const raw = await this.api.getAllTeams();
      teams = this.normalize(raw);

      // Then store it in the cache for faster retrieval later
      this.cache.set(TEAMS_CACHE_KEY, teams);

      // Store each individual team, too
      teams.forEach(team => {
        const key = this.getTeamCacheKey(team.id);
        this.cache.set(key, team);
      });
    } else {
      console.log('[NbaService.getAllTeams] Found in cache');
    }

    return teams;
  }

  /**
   * @function getTeam
   * Retrieves a single NBA team by its ID.
   * @param {number} id - NBA team ID
   * @returns {Promise<object>} Promise for an NBA team object
   */
  async getTeam(id) {
    // See if the data is in the cache first
    const key = this.getTeamCacheKey(id);
    let team = this.cache.get(key);

    if (!team) {
      console.log(`[NbaService.getTeam(${id})] Not in cache. Fetching from the API`);
      // Not in the cache, so fetch from the API
      const raw = await this.api.getTeam(id);
      team = this.normalize(raw);

      // Then store it in the cache for faster retrieval later
      this.cache.set(key, team);
    } else {
      console.log(`[NbaService.getTeam(${id})] Found in cache`);
    }

    return team;
  }

  /**
   * @function normalize
   * Normalizes incoming NBA team data from the API into a format that's more
   * useful to this application.
   * @param {object} data - NBA team data object
   */
  normalize(data) {
    /**
     * Some teams have the wrong city name from the API, which throws off the
     * subsequent weather data. Correcting those manually is a bit of a hack,
     * but it'll work until the API spits out the correct data. This is a map
     * of known problem teams with their correct cities.
     */
    const corrected = {
      // Brooklyn is a borough of New York City, and the weather API doesn't
      // recognize it as a city, so New York must be used instead
      'BKN': 'New York',
      // The Golden State Warriors are located in San Francisco, not "Golden
      // State"
      'GSW': 'San Francisco',
      // The Indiana Pacers are located in Indianapolis, not just "Indiana"
      'IND': 'Indianapolis',
      // The Minnesota Timberwolves are located in Minneapolis, not the city of
      // "Minnesota"
      'MIN': 'Minneapolis',
      // The Utah Jazz are located in Salt Lake City, not the city of "Utah"
      'UTA': 'Salt Lake City',
    };

    /**
     * @function correct
     * Helper function to correct team data in place.
     * @param {object} team - Team to correct
     */
    const correct = team => {
      // If this team is in the map and doesn't have the correct city
      if (corrected[team.abbreviation] &&
          team.city !== corrected[team.abbreviation]) {
        // Then assign the correct city
        team.city = corrected[team.abbreviation];
      }
    };

    if (Array.isArray(data)) {
      data.forEach(team => correct(team));
    } else {
      correct(data);
    }

    return data;
  }

  /**
   * @function getTeamCacheKey
   * Builds a cache key for the given team.
   * @param {number} id - Team ID for which to build the key
   * @returns {string} Cache key
   */
  getTeamCacheKey = id => `${TEAM_CACHE_KEY_PREFIX}${id}`;
}

module.exports = NbaService;
