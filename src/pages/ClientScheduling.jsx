import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SchedulingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const DatePicker = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const TimeSlot = styled(motion.button)`
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  background-color: ${props => props.isAvailable ? props.theme.colors.primary : props.theme.colors.secondary};
  color: white;
  cursor: ${props => props.isAvailable ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.isAvailable ? 1 : 0.5};
`;

const ConfirmationMessage = styled.p`
  margin-top: 1rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const ClientScheduling = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const timeSlots = [
    { time: '9:00 AM', isAvailable: true },
    { time: '10:00 AM', isAvailable: false },
    { time: '11:00 AM', isAvailable: true },
    { time: '1:00 PM', isAvailable: true },
    { time: '2:00 PM', isAvailable: false },
    { time: '3:00 PM', isAvailable: true },
  ];

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
    setConfirmation('');
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setConfirmation(`Your appointment is scheduled for ${selectedDate} at ${time}`);
  };

  return (
    <SchedulingContainer>
      <Title>Schedule Your Nail Appointment</Title>
      <DatePicker 
        type="date" 
        value={selectedDate} 
        onChange={handleDateChange}
      />
      {selectedDate && (
        <div>
          <h2>Available Time Slots for {selectedDate}</h2>
          {timeSlots.map((slot, index) => (
            <TimeSlot
              key={index}
              isAvailable={slot.isAvailable}
              onClick={() => slot.isAvailable && handleTimeSelection(slot.time)}
              whileHover={{ scale: slot.isAvailable ? 1.05 : 1 }}
              whileTap={{ scale: slot.isAvailable ? 0.95 : 1 }}
            >
              {slot.time}
            </TimeSlot>
          ))}
        </div>
      )}
      {confirmation && <ConfirmationMessage>{confirmation}</ConfirmationMessage>}
    </SchedulingContainer>
  );
};

export default ClientScheduling;