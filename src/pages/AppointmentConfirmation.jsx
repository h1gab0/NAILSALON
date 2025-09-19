import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import CouponCard from '../components/CouponCard.jsx';

const ConfirmationContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const Details = styled.p`
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  margin-top: 1rem;
  border-radius: 8px;
`;

const TrendButton = styled(motion.button)`
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
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Loading = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Error = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.danger};
`;

const AppointmentConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/appointments/${id}`);
        if (!response.ok) {
          throw new Error('Appointment not found');
        }
        const data = await response.json();
        setAppointment(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const handleTrendClick = (e) => {
    e.preventDefault();
    navigate('/', { state: { scrollToTrends: true } });
  };

  if (loading) {
    return (
      <ConfirmationContainer>
        <Loading>Loading confirmation...</Loading>
      </ConfirmationContainer>
    );
  }

  if (error) {
    return (
      <ConfirmationContainer>
        <Error>{error}</Error>
      </ConfirmationContainer>
    );
  }

  if (!appointment) {
    return (
      <ConfirmationContainer>
        <Error>Appointment not found.</Error>
      </ConfirmationContainer>
    );
  }

  return (
    <ConfirmationContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Appointment Confirmed!</Title>
        <Details><strong>Name:</strong> {appointment.client.name}</Details>
        <Details><strong>Date:</strong> {format(parseISO(appointment.date), 'MMMM d, yyyy')}</Details>
        <Details><strong>Time:</strong> {appointment.time}</Details>
        {appointment.image && (
          <>
            <Details><strong>Design Inspiration:</strong></Details>
            <ImagePreview src={appointment.image} alt="Design Inspiration" />
          </>
        )}

        {appointment.coupon && (
          <>
            <Title style={{ marginTop: '2rem', fontSize: '1.5rem' }}>Your Promotional Offer!</Title>
            <CouponCard coupon={appointment.coupon} />
          </>
        )}

        <TrendButton
          onClick={handleTrendClick}
          whileHover={{ translateY: -4 }}
          whileTap={{ translateY: 0 }}
        >
          View Nail Trends
        </TrendButton>
      </motion.div>
    </ConfirmationContainer>
  );
};

export default AppointmentConfirmation;