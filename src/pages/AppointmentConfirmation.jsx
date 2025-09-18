import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { motion } from 'framer-motion';
import CouponCard from '../components/CouponCard.jsx';

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
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`/api/appointments/${id}`);
        const appointmentData = await response.json();
        setAppointment(appointmentData);
      } catch (error) {
        console.error('Error fetching appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  if (loading) {
    return <ConfirmationContainer theme={theme}>Loading...</ConfirmationContainer>;
  }

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
      {appointment.discount > 0 && (
        <Details>Discount Applied: {appointment.discount}%</Details>
      )}
      {appointment.image && (
        <>
          <Details>Design Inspiration:</Details>
          <ImagePreview src={appointment.image} alt="Design Inspiration" />
        </>
      )}
      {appointment.generatedCoupon && <CouponCard coupon={appointment.generatedCoupon} />}
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