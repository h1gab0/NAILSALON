import React, { useState, useEffect } from 'react';
import { WeatherForm as StyledWeatherForm, WeatherInput, WeatherButton, WeatherSuggestions, WeatherSuggestion } from './StyledComponents';

function WeatherForm({ fetchWeather, setError }) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en&format=json`);
        const data = await response.json();
        setSuggestions(data.results || []);
        setShowSuggestions(true);
      } catch (err) {
        setError(err.message);
      }
    };

    if (city.trim().length > 2) {
      fetchSuggestions();
    } else {
      setShowSuggestions(false);
    }
  }, [city, setError]);const handleSearch = async (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude } = data.results[0];
      fetchWeather(latitude, longitude);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setShowSuggestions(false);
    fetchWeather(suggestion.latitude, suggestion.longitude);
  };

  return (
    <StyledWeatherForm onSubmit={handleSearch}>
      <WeatherInput
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        whileFocus={{ scale: 1.05 }}
      />
      <WeatherButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Search
      </WeatherButton>
      {showSuggestions && suggestions.length > 0 && (
        <WeatherSuggestions>
          {suggestions.map((suggestion, index) => (
            <WeatherSuggestion
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              whileHover={{ backgroundColor: `${({ theme }) => theme.colors.secondary}` }}
            >
              {suggestion.name}
            </WeatherSuggestion>
          ))}
        </WeatherSuggestions>
      )}
    </StyledWeatherForm>
  );
}

export default WeatherForm;
