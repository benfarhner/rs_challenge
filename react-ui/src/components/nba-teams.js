/**
 * @fileoverview Implements a view displaying a list of NBA teams.
 */

import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography
} from '@mui/material';

export default function NbaTeams(props) {
  const { loading, onSelected, teams } = props;
  const [selected, setSelected] = useState('');

  /**
   * @function handleTeamSelected
   * Handles when the user selects a team.
   * @param {object} team - Team that was selected
   */
  const handleTeamSelected = event => {
    const selectedId = Number(event.target.value);
    const selectedTeam = teams.find(team => team.id === selectedId);
    setSelected(selectedId);
    onSelected && onSelected(selectedTeam);
  };

  useEffect(() => {
    // Unset selected team when loading or if no teams are available
    if (loading || !teams || teams.length === 0) {
      setSelected('');
    }
  }, [loading, teams]);

  // If the weather data is still loading, show a progress indicator
  if (loading) {
    return (
      <Box my={2} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  // If no team data is available and it's not loading, don't show anything
  if (!teams || teams.length === 0) {
    return null;
  }

  return (
    <Box my={2}>
      <Box mb={2}>
        <Typography variant="body1">
          Pick a team to see the weather in their city
        </Typography>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="nba-team-select-label">NBA Team</InputLabel>
        <Select
          labelId="nba-team-select-label"
          value={selected}
          label="NBA Team"
          onChange={handleTeamSelected}
        >
          {teams && teams.map(team =>
            <MenuItem key={team.id} value={team.id}>
              {team.abbreviation} - {team.full_name}
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
