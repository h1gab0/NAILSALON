import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';

const ControlContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 4px;
`;

const ToggleButton = styled.button`
  background-color: ${({ isAvailable, theme }) => isAvailable ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const TimeSlotContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const TimeSlotToggle = styled.button`
  background-color: ${({ isAvailable, theme }) => isAvailable ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.5rem;
  margin: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
`;

const DayAvailabilityControl = ({ selectedDate, onAvailabilityChange }) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [availableSlots, setAvailableSlots] = useState({});

  useEffect(() => {
    // Reset state when selectedDate changes
    setIsAvailable(false);
    setAvailableSlots({});
  }, [selectedDate]);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    onAvailabilityChange(selectedDate, !isAvailable, availableSlots);
  };

  const toggleTimeSlot = (time) => {
    const updatedSlots = { ...availableSlots, [time]: !availableSlots[time] };
    setAvailableSlots(updatedSlots);
    onAvailabilityChange(selectedDate, isAvailable, updatedSlots);
  };

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'];

  return (
    <ControlContainer>
      <h3>Availability for {format(selectedDate, 'MMMM d, yyyy')}</h3>
      <ToggleButton isAvailable={isAvailable} onClick={toggleAvailability}>
        {isAvailable ? 'Set as Unavailable' : 'Set as Available'}
      </ToggleButton>
      {isAvailable && (
        <TimeSlotContainer>
          {timeSlots.map((time) => (
            <TimeSlotToggle
              key={time}
              isAvailable={availableSlots[time]}
              onClick={() => toggleTimeSlot(time)}
            >
              {time}
            </TimeSlotToggle>
          ))}
        </TimeSlotContainer>
      )}
    </ControlContainer>
  );
};

export default DayAvailabilityControl;