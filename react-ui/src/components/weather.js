/**
 * @fileoverview Implements a view of current weather data.
 */

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Typography
} from '@mui/material';
import '../styles/weather.css';

export default function Weather(props) {
  const { loading, weather } = props;

  // If the weather data is still loading, show a progress indicator
  if (loading) {
    return (
      <Box my={2} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  // If no weather data is available and it's not loading, don't show anything
  if (!weather) {
    return null;
  }

  return (
    <Box my={2}>
      <Card className="weather-card">
        <CardContent>
          <Typography gutterBottom variant="h5">
            Weather
          </Typography>
          <Typography variant="body2" gutterBottom>
            {weather.summary}
          </Typography>
        </CardContent>
        {weather.iconUrl &&
          <img alt={weather.iconAlt} src={weather.iconUrl} />
        }
      </Card>
    </Box>
  );
}
