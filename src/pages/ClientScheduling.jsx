// src/components/ClientScheduling.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import AppointmentConfirmation from './AppointmentConfirmation';

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

const ClientScheduling = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      // Fetch available slots from local storage
      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
      const bookedSlots = appointments
        .filter(appointment => appointment.date === selectedDate)
        .map(appointment => appointment.time);

      const allSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'
      ];

      setAvailableSlots(allSlots.map(slot => ({
        time: slot,
        isAvailable: !bookedSlots.includes(slot)
      })));
    }
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setShowConfirmation(true);
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
          {availableSlots.map((slot, index) => (
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
      {showConfirmation && (
        <AppointmentConfirmation
          date={selectedDate}
          time={selectedTime}
          onClose={() => setShowConfirmation(false)}
        />
      )}
    </SchedulingContainer>
  );
};

export default ClientScheduling;