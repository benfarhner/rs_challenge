/**
 * @fileoverview Implements the main user flow.
 */

import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import Api from '../lib/api';
import NbaTeam from './nba-team';
import NbaTeams from './nba-teams';
import Weather from './weather';
import '../styles/user-flow.css';

export default function UserFlow() {
  /**
   * Whether the team data is currently being loaded from the API.
   */
  const [loadingTeams, setLoadingTeams] = useState(false);

  /**
   * Whether the weather data is currently being loaded from the API.
   */
  const [loadingWeather, setLoadingWeather] = useState(false);

  /**
   * The currently selected NBA team.
   */
  const [team, setTeam] = useState(null);

  /**
   * The list of NBA teams in the current season.
   */
  const [teams, setTeams] = useState(null);

  /**
   * The current weather for the currently selected team.
   */
  const [weather, setWeather] = useState(null);

  /**
   * @function handleStartClick
   * Handles when the user clicks on the "start" button to kick off the user
   * flow.
   */
  const handleStartClick = () => {
    // Reset state of the user flow
    setTeam(null);
    setTeams(null);
    setWeather(null);
    setLoadingTeams(true);

    // Query the API for the NBA teams in the current season
    const api = new Api();
    api.getNbaTeams()
      .then(teams => {
        setTeams(teams);
        setLoadingTeams(false);
      });
  };

  /**
   * @function handleTeamClicked
   * Handles when the user clicks on a specific NBA team to get the current
   * weather in their city.
   * @param {object} team - The team that the user clicked on
   */
  const handleTeamClicked = team => setTeam(team);

  /**
   * When the currently selected team changes, look up the weather in their
   * city.
   */
  useEffect(() => {
    if (!team) {
      // No team selected, so clear out weather info
      setWeather(null);
    } else {
      setLoadingWeather(true);

      // Query the API for the current weather in the selected team's city
      const api = new Api();
      api.getCurrentWeatherForTeam(team.id)
        .then(weather => {
          setWeather(weather);
          setLoadingWeather(false);
        });
    }
  }, [team]);

  return (
    <Box className="user-flow">
      <Box>
        <Button
          disableElevation
          fullWidth
          onClick={handleStartClick}
          size="large"
          variant="contained"
        >
          Get current NBA teams
        </Button>
      </Box>
      <NbaTeams
        loading={loadingTeams}
        onSelected={handleTeamClicked}
        teams={teams}
      />
      <NbaTeam team={team} />
      <Weather loading={loadingWeather} weather={weather} />
    </Box>
  );
}
