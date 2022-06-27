/**
 * @fileoverview Implements a controller for the NBA resource.
 */

const express = require('express');
const NbaService = require('../services/nba-service');

const controller = express.Router();

/**
 * GET /nba/teams
 * Retrieves the NBA teams for the current season.
 */
controller.get('/teams', async (req, res) => {
  const nbaService = new NbaService();
  const teams = await nbaService.getAllTeams();

  res.set('Content-Type', 'application/json');
  res.send(teams);
});

module.exports = controller;
