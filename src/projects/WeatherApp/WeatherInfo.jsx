import React from 'react';
import { WeatherInfo as StyledWeatherInfo, WeatherTemp, WeatherDescription, WeatherLocation } from './StyledComponents';

function WeatherInfo({ weather, location }) {
  return (
    <StyledWeatherInfo>
      <WeatherLocation>
        {location.name}, {location.admin1 && `${location.admin1},`} {location.country}
      </WeatherLocation>
      <WeatherTemp>{Math.round(weather.temperature)}°C</WeatherTemp>
      <WeatherDescription>
        Wind Speed: {weather.windspeed} m/s
      </WeatherDescription>
      <p>Humidity: {weather.humidity}%</p>
    </StyledWeatherInfo>
  );
}

export default WeatherInfo;