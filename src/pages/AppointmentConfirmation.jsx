import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

const ConfirmationContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const Details = styled.p`
  margin-bottom: 0.5rem;
`;

const LinkButton = styled(Link)`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const AppointmentConfirmation = () => {
  const { id } = useParams();
  const theme = useTheme();
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const appointment = appointments.find(app => app.id === parseInt(id));

  if (!appointment) {
    return <ConfirmationContainer theme={theme}>Appointment not found.</ConfirmationContainer>;
  }

  return (
    <ConfirmationContainer theme={theme}>
      <Title>Appointment Confirmed!</Title>
      <Details>Date: {appointment.date}</Details>
      <Details>Time: {appointment.time}</Details>
      <Details>Appointment ID: {appointment.id}</Details>
      <LinkButton to="/trends">Discover Nail Trends</LinkButton>
    </ConfirmationContainer>
  );
};

export default AppointmentConfirmation;