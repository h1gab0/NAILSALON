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

import { useState, useEffect } from 'react';

const AppointmentConfirmation = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const fetchAppointmentAndGenerateCoupon = async () => {
      try {
        const response = await fetch(`/api/appointments/${id}`);
        const currentAppointment = await response.json();
        setAppointment(currentAppointment);

        if (currentAppointment) {
          const clientResponse = await fetch('/api/clients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: currentAppointment.phone, name: currentAppointment.clientName })
          });
          const client = await clientResponse.json();

          const couponResponse = await fetch('/api/coupons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: client.id })
          });
          const newCoupon = await couponResponse.json();
          setCoupon(newCoupon);
        }
      } catch (error) {
        console.error('Error fetching appointment or generating coupon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentAndGenerateCoupon();
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
      {coupon && (
        <>
          <Title>Your Exclusive Offer!</Title>
          <Details>
            Here's a {coupon.discount}% discount for your next visit!
          </Details>
          <Details>
            Your code is: <strong>{coupon.code}</strong>
          </Details>
          <Details>
            Expires on: {new Date(coupon.expiresAt).toLocaleDateString()}
          </Details>
        </>
      )}
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