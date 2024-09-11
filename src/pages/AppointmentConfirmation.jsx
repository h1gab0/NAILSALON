// src/components/AppointmentConfirmation.js
import React, { useState } from 'react';
import styled from 'styled-components';

const ConfirmationContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;

const AppointmentConfirmation = ({ date, time, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleConfirm = () => {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const newAppointment = {
      id: Date.now(),
      date,
      time,
      clientName: name,
      phone,
      status: 'scheduled'
    };
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    alert(`Appointment confirmed! Your appointment number is ${newAppointment.id}`);
    onClose();
  };

  return (
    <ConfirmationContainer>
      <h2>Confirm Your Appointment</h2>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
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
      <Button onClick={handleConfirm}>Confirm Appointment</Button>
    </ConfirmationContainer>
  );
};

export default AppointmentConfirmation;
