import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { motion } from 'framer-motion';

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

const LinkButton = styled(motion(Link))`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const CouponButton = styled(motion(Link))`
  display: block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const TrendButton = styled(motion(Link))`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const AppointmentConfirmation = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
  const appointment = appointments.find(app => app.id === parseInt(id));

  if (!appointment) {
    return <ConfirmationContainer theme={theme}>Appointment not found.</ConfirmationContainer>;
  }

  const handleTrendClick = (e) => {
    e.preventDefault();
    navigate('/', { state: { scrollToTrends: true } });
  };

  return (
    <ConfirmationContainer theme={theme}>
      <Title>Appointment Confirmed!</Title>
      <Details>Date: {appointment.date}</Details>
      <Details>Time: {appointment.time}</Details>
      <Details>Appointment ID: {appointment.id}</Details>
      {appointment.image && (
        <>
          <Details>Design Inspiration:</Details>
          <ImagePreview src={appointment.image} alt="Design Inspiration" />
        </>
      )}
      <CouponButton
        to="/coupon"
        whileHover={{ scale: 1.05, translateY: -4 }}
        whileTap={{ scale: 0.95, translateY: 0 }}
      >
        Choose Your Special Offer
      </CouponButton>
      <TrendButton
        to="/trends"
        onClick={handleTrendClick}
        whileHover={{ translateY: -4 }}
        whileTap={{ translateY: 0 }}
      >
        View Nail Trends
      </TrendButton>
    </ConfirmationContainer>
  );
};

export default AppointmentConfirmation;