import React from 'react';
import { WeatherInfo as StyledWeatherInfo, WeatherTemp, WeatherDescription } from './StyledComponents';

function WeatherInfo({ weather }) {
  return (
    <StyledWeatherInfo>
      <WeatherTemp>{Math.round(weather.temperature)}°C</WeatherTemp>
      <WeatherDescription>
        Wind Speed: {weather.windspeed} m/s
      </WeatherDescription>
      <p>Humidity: {weather.humidity}%</p>
    </StyledWeatherInfo>
  );
}

export default WeatherInfo;