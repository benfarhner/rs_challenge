/**
 * @fileoverview Implements a view for a specific NBA team
 */

import { Box, Card, CardContent, Typography } from "@mui/material";

export default function NbaTeam(props) {
  const { team } = props;

  if (!team) {
    return null;
  }

  return (
    <Box my={2}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {team.name}
          </Typography>
          <Typography variant="body2">
            <b>Name:</b> {team.full_name} ({team.abbreviation})
            <br />
            <b>City:</b> {team.city}
            <br />
            <b>Conference:</b> {team.conference}
            <br />
            <b>Division:</b> {team.division}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}