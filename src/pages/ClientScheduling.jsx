import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { format, addDays, isAfter, parseISO, startOfDay, isBefore } from 'date-fns';
import { FaCalendarAlt, FaClock, FaUser, FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StepContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

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
  min-height: 150px;
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

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ImageUploadContainer = styled.div`
  margin-top: 1rem;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
`;

const ClientScheduling = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [step, setStep] = useState('date');
  const navigate = useNavigate();

  const removePastTimeSlotsAndEmptyDates = () => {
    const now = new Date();
    const availability = JSON.parse(localStorage.getItem('availability')) || {};
    const updatedAvailability = { ...availability };
    let hasChanges = false;

    Object.keys(updatedAvailability).forEach(dateString => {
      const date = parseISO(dateString);
      const dateStart = startOfDay(date);
      
      if (isBefore(dateStart, startOfDay(now))) {
        delete updatedAvailability[dateString];
        hasChanges = true;
      } else {
        const availableSlots = updatedAvailability[dateString].availableSlots;
        Object.keys(availableSlots).forEach(timeSlot => {
          const slotTime = parseISO(`${dateString}T${timeSlot}`);
          if (isBefore(slotTime, now)) {
            delete availableSlots[timeSlot];
            hasChanges = true;
          }
        });
        
        // Remove the date if there are no available slots left
        if (Object.keys(availableSlots).length === 0) {
          delete updatedAvailability[dateString];
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      localStorage.setItem('availability', JSON.stringify(updatedAvailability));
      window.dispatchEvent(new Event('storage'));
    }

    return updatedAvailability;
  };

  const loadAvailability = () => {
    const updatedAvailability = removePastTimeSlotsAndEmptyDates();
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

    const today = startOfDay(new Date());
    const nextThirtyDays = Array.from({ length: 30 }, (_, i) => format(addDays(today, i), 'yyyy-MM-dd'));
    
    const availableDatesWithSlots = nextThirtyDays.filter(date => {
      const dateAvailability = updatedAvailability[date] || { isAvailable: false, availableSlots: {} };
      const bookedSlots = appointments.filter(appointment => appointment.date === date).map(appointment => appointment.time);
      const availableSlots = Object.entries(dateAvailability.availableSlots)
        .filter(([slot, isAvailable]) => isAvailable && !bookedSlots.includes(slot));
      
      const isDateAvailable = dateAvailability.isAvailable && availableSlots.length > 0;
      return isDateAvailable;
    });

    setAvailableDates(availableDatesWithSlots);

    if (selectedDate) {
      const dateAvailability = updatedAvailability[selectedDate] || { isAvailable: false, availableSlots: {} };
      const bookedSlots = appointments
        .filter(appointment => appointment.date === selectedDate)
        .map(appointment => appointment.time);

      const currentTime = new Date();
      const slotsWithAvailability = Object.entries(dateAvailability.availableSlots)
        .filter(([_, isAvailable]) => isAvailable)
        .map(([slot, _]) => {
          const slotTime = parseISO(`${selectedDate}T${slot}`);
          return {
            time: slot,
            isAvailable: dateAvailability.isAvailable && !bookedSlots.includes(slot) && isAfter(slotTime, currentTime)
          };
        })
        .filter(slot => slot.isAvailable);

      setAvailableSlots(slotsWithAvailability);
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

    const interval = setInterval(loadAvailability, 60000); // Run every minute

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedDate]);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep('time');
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    setStep('info');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmAppointment = () => {
    if (!name || !phone) {
      alert('Please enter your name and phone number');
      return;
    }

    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const newAppointment = {
      id: Date.now(),
      date: selectedDate,
      time: selectedTime,
      clientName: name,
      phone: phone,
      status: 'scheduled',
      image: image
    };
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    const availability = JSON.parse(localStorage.getItem('availability')) || {};
    if (availability[selectedDate] && availability[selectedDate].availableSlots) {
      availability[selectedDate].availableSlots[selectedTime] = false;
      localStorage.setItem('availability', JSON.stringify(availability));
    }

    window.dispatchEvent(new Event('storage'));

    navigate(`/appointment-confirmation/${newAppointment.id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
  };

  return (
    <SchedulingContainer>
      <Title>Schedule Your Nail Appointment</Title>
      <LayoutGroup>
        <AnimatePresence mode="wait">
          {step === 'date' && (
            <StepContainer
              key="date-selection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
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
                      layout
                    >
                      {format(parseISO(date), 'MMM d')}
                    </DateButton>
                  ))
                ) : (
                  <NoDatesMessage>No available dates. Please check back later.</NoDatesMessage>
                )}
              </DateGrid>
            </StepContainer>
          )}

          {step === 'time' && (
            <StepContainer
              key="time-selection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
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
                    layout
                  >
                    {slot.time}
                  </TimeSlot>
                ))}
              </TimeGrid>
            </StepContainer>
          )}

          {step === 'info' && (
            <StepContainer
              key="info-collection"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <StepTitle>
                <StepIcon><FaUser /></StepIcon>
                Your Information
              </StepTitle>
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="tel"
                placeholder="Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <ImageUploadContainer>
                <StepTitle>
                  <StepIcon><FaImage /></StepIcon>
                  Upload Design Inspiration (Optional)
                </StepTitle>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {image && <ImagePreview src={image} alt="Design Inspiration" />}
              </ImageUploadContainer>
              <Button onClick={handleConfirmAppointment}>Confirm Appointment</Button>
            </StepContainer>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </SchedulingContainer>
  );
};

export default ClientScheduling;