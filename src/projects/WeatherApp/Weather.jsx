import React, { useState } from 'react';
import WeatherForm from './WeatherForm';
import WeatherInfo from './WeatherInfo';
import { WeatherContainer } from './StyledComponents';

function WeatherApp() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (lat, lon, name, admin1, country) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`);
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      const data = await response.json();

      setWeather({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        humidity: data.hourly.relativehumidity_2m[0],
      });

      setLocation({ name, admin1, country });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContainer>
      <WeatherForm fetchWeather={fetchWeather} setError={setError} />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {weather && location && <WeatherInfo weather={weather} location={location} />}
    </WeatherContainer>
  );
}

export default WeatherApp;