/**
 * @fileoverview Implements a controller for the NBA resource.
 */

const express = require('express');
const NbaService = require('../services/nba-service');
const WeatherService = require('../services/weather-service');

const controller = express.Router();

/**
 * GET /weather/currentForNbaTeam/:id
 * Retrieves the current weather for the given NBA team's city.
 */
controller.get('/currentForNbaTeam', async (req, res) => {
  const nbaService = new NbaService();
  const weatherService = new WeatherService();

  if (!req.query.id || req.query.id.length === 0) {
    // Missing required `id` param, so return 400 Bad Request
    res.status = 400;
    return;
  }

  const team = await nbaService.getTeam(req.query.id);

  if (!team) {
    // NBA team with that ID was not found
    res.status = 404;
    return;
  }

  const weather = await weatherService
    .getCurrentWeatherForCity(team.city);

  if (!weather) {
    // Weather for that team's city was not found
    res.status = 404;
    return;
  }

  res.set('Content-Type', 'application/json');
  res.send(weather);
});

/**
 * GET /weather/current/:city
 * Retrieves the current weather for the given city.
 */
controller.get('/current', async (req, res) => {
  const weatherService = new WeatherService();

  if (!req.query.city || req.query.city.length === 0) {
    // Missing required `city` param, so return 400 Bad Request
    res.status = 400;
    return;
  }

  const weather = await weatherService
    .getCurrentWeatherForCity(req.query.city);

  if (!weather) {
    // Weather for that city was not found
    res.status = 404;
    return;
  }

  res.set('Content-Type', 'application/json');
  res.send(weather);
});

module.exports = controller;