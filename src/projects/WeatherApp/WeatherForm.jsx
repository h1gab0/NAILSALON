import React, { useState, useEffect, useCallback } from 'react';
import { WeatherForm as StyledWeatherForm, WeatherInput, WeatherButton, WeatherSuggestions, WeatherSuggestion } from './StyledComponents';

function WeatherForm({ fetchWeather, setError }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userSelected, setUserSelected] = useState(false);

  const fetchSuggestions = useCallback(async (searchInput) => {
    if (searchInput.trim().length <= 2 || userSelected) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchInput}&count=10&language=en&format=json`);
      const data = await response.json();
      
      if (data.results) {
        // Filter and sort results based on the input matching city, state, or country
        const filteredResults = data.results
          .filter(result => 
            (result.name && result.name.toLowerCase().includes(searchInput.toLowerCase())) ||
            (result.admin1 && result.admin1.toLowerCase().includes(searchInput.toLowerCase())) ||
            (result.country && result.country.toLowerCase().includes(searchInput.toLowerCase()))
          )
          .sort((a, b) => {
            const aScore = getMatchScore(a, searchInput);
            const bScore = getMatchScore(b, searchInput);
            return bScore - aScore;
          })
          .slice(0, 5); // Limit to top 5 results

        setSuggestions(filteredResults);
        setShowSuggestions(filteredResults.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [setError, userSelected]);

  const getMatchScore = (result, searchInput) => {
    const lowercaseInput = searchInput.toLowerCase();
    let score = 0;
    if (result.name && result.name.toLowerCase().startsWith(lowercaseInput)) score += 3;
    else if (result.name && result.name.toLowerCase().includes(lowercaseInput)) score += 2;
    if (result.admin1 && result.admin1.toLowerCase().includes(lowercaseInput)) score += 1;
    if (result.country && result.country.toLowerCase().includes(lowercaseInput)) score += 1;
    return score;
  };

  useEffect(() => {
    if (!userSelected) {
      fetchSuggestions(input);
    }
  }, [input, fetchSuggestions, userSelected]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setUserSelected(true);

    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=1&language=en&format=json`);
      if (!response.ok) {
        throw new Error('Location not found');
      }
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('Location not found');
      }

      const { latitude, longitude, name, admin1, country } = data.results[0];
      fetchWeather(latitude, longitude, name, admin1, country);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(`${suggestion.name || ''}, ${suggestion.admin1 || ''} ${suggestion.country || ''}`.trim().replace(/^,\s*/, ''));
    setShowSuggestions(false);
    setUserSelected(true);
    fetchWeather(suggestion.latitude, suggestion.longitude, suggestion.name, suggestion.admin1, suggestion.country);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setUserSelected(false);
    if (value.trim().length > 2) {
      fetchSuggestions(value);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <StyledWeatherForm onSubmit={handleSearch}>
      <WeatherInput
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter city, state, or country"
        whileFocus={{ scale: 1.05 }}
      />
      <WeatherButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Search
      </WeatherButton>
      {showSuggestions && suggestions.length > 0 && !userSelected && (
        <WeatherSuggestions>
          {suggestions.map((suggestion, index) => (
            <WeatherSuggestion
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
            >
              {suggestion.name || ''}{suggestion.admin1 ? `, ${suggestion.admin1}` : ''}{suggestion.country ? `, ${suggestion.country}` : ''}
            </WeatherSuggestion>
          ))}
        </WeatherSuggestions>
      )}
    </StyledWeatherForm>
  );
}

export default WeatherForm;