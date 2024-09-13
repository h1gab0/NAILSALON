import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import AppointmentConfirmation from './AppointmentConfirmation';
import { format, addDays, isAfter, parseISO } from 'date-fns';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const SchedulingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const StepContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const StepTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const StepIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.2rem;
`;

const DateGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  min-height: 150px; // Add a minimum height to ensure vertical centering
  justify-content: center;
  align-items: center;
`;

const DateButton = styled(motion.button)`
  padding: 1rem;
  border: none;
  background-color: ${({ isSelected, theme }) => isSelected ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TimeSlot = styled(motion.button)`
  padding: 0.5rem;
  border: none;
  background-color: ${({ isAvailable, isSelected, theme }) => 
    isSelected ? theme.colors.primary : 
    isAvailable ? theme.colors.secondary : 
    theme.colors.background};
  color: ${({ isAvailable, theme }) => isAvailable ? 'white' : theme.colors.text};
  border-radius: 8px;
  cursor: ${({ isAvailable }) => isAvailable ? 'pointer' : 'not-allowed'};
  opacity: ${({ isAvailable }) => isAvailable ? 1 : 0.5};
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: ${({ isAvailable }) => isAvailable ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ isAvailable }) => isAvailable ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const NoDatesMessage = styled.p`
  text-align: center;
  width: 100%;
  padding: 1rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text};
`;

const ClientScheduling = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);

  const loadAvailability = () => {
    try {
      const availability = JSON.parse(localStorage.getItem('availability')) || {};
      const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

      console.log('Raw availability data:', availability);
      console.log('Raw appointments data:', appointments);

      const today = new Date();
      const nextThirtyDays = Array.from({ length: 30 }, (_, i) => format(addDays(today, i), 'yyyy-MM-dd'));
      
      const availableDatesWithSlots = nextThirtyDays.filter(date => {
        const dateAvailability = availability[date] || { isAvailable: false, availableSlots: {} };
        const bookedSlots = appointments.filter(appointment => appointment.date === date).map(appointment => appointment.time);
        const availableSlots = Object.entries(dateAvailability.availableSlots)
          .filter(([slot, isAvailable]) => isAvailable && !bookedSlots.includes(slot));
        
        const isDateAvailable = dateAvailability.isAvailable && availableSlots.length > 0 && isAfter(parseISO(date), today);
        console.log(`Date ${date} availability:`, isDateAvailable);
        return isDateAvailable;
      });

      console.log('Available dates with slots:', availableDatesWithSlots);

      setAvailableDates(availableDatesWithSlots);

      if (selectedDate) {
        const dateAvailability = availability[selectedDate] || { isAvailable: false, availableSlots: {} };
        const bookedSlots = appointments
          .filter(appointment => appointment.date === selectedDate)
          .map(appointment => appointment.time);

        const slotsWithAvailability = Object.entries(dateAvailability.availableSlots)
          .filter(([_, isAvailable]) => isAvailable)
          .map(([slot, _]) => ({
            time: slot,
            isAvailable: dateAvailability.isAvailable && !bookedSlots.includes(slot)
          }));

        console.log('Available slots for selected date:', slotsWithAvailability);
        setAvailableSlots(slotsWithAvailability);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  useEffect(() => {
    loadAvailability();

    const handleStorageChange = (e) => {
      if (e.key === 'availability' || e.key === 'appointments') {
        loadAvailability();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [selectedDate]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setShowConfirmation(false);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setShowConfirmation(true);
  };

  return (
    <SchedulingContainer>
      <Title>Schedule Your Nail Appointment</Title>
      <AnimatePresence>
        <StepContainer
          key="date-selection"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <StepTitle>
            <StepIcon><FaCalendarAlt /></StepIcon>
            Select a Date
          </StepTitle>
          <DateGrid>
            {availableDates.length > 0 ? (
              availableDates.map((date) => (
                <DateButton
                  key={date}
                  isSelected={date === selectedDate}
                  onClick={() => handleDateSelection(date)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {format(parseISO(date), 'MMM d')}
                </DateButton>
              ))
            ) : (
              <NoDatesMessage>No available dates. Please check back later.</NoDatesMessage>
            )}
          </DateGrid>
        </StepContainer>

        {selectedDate && (
          <StepContainer
            key="time-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <StepTitle>
              <StepIcon><FaClock /></StepIcon>
              Select a Time
            </StepTitle>
            <TimeGrid>
              {availableSlots.map((slot, index) => (
                <TimeSlot
                  key={index}
                  isAvailable={slot.isAvailable}
                  isSelected={selectedTime === slot.time}
                  onClick={() => slot.isAvailable && handleTimeSelection(slot.time)}
                  whileHover={{ scale: slot.isAvailable ? 1.05 : 1 }}
                  whileTap={{ scale: slot.isAvailable ? 0.95 : 1 }}
                >
                  {slot.time}
                </TimeSlot>
              ))}
            </TimeGrid>
          </StepContainer>
        )}

        {showConfirmation && (
          <StepContainer
            key="confirmation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AppointmentConfirmation
              date={selectedDate}
              time={selectedTime}
              onClose={() => {
                setShowConfirmation(false);
                setSelectedTime('');
                loadAvailability();
              }}
            />
          </StepContainer>
        )}
      </AnimatePresence>
    </SchedulingContainer>
  );
};

export default ClientScheduling;