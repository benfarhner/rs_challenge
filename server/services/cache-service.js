/**
 * @fileoverview Implements an abstracted cache service.
 * 
 * Under the hood, this is using a simple in-memory cache, but for a production
 * solution, this should be an external cache like Redis.
 */

const NodeCache = require('node-cache');

class CacheService {
  // Initialize the underlying cache library
  static cache = new NodeCache();

  /**
   * @constructor
   * @param {number} [ttl] - Optional time to live in seconds for items in this
   * cache. If given, must be greater than zero.
   */
  constructor(ttl) {
    this.ttl = ttl;
  }

  /**
   * @function get
   * Retrieves an item from the cache with the given key
   * @param {string} key - Cache item key
   * @returns {any} Cache item value if found, or null
   */
  get(key) {
    const value = CacheService.cache.get(key);

    if (!value) {
      return null;
    }

    return value;
  }

  /**
   * @function set
   * Sets a value in the cache using the given key.
   * @param {string} key - Cache item key
   * @param {any} value - Cache item value
   * @returns {boolean} Whether the operation was a success
   */
  set(key, value) {
    return CacheService.cache.set(key, value, this.ttl);
  }
}

module.exports = CacheService;
