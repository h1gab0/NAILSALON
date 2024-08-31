import styled from 'styled-components';
import { motion } from 'framer-motion';

export const WeatherContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5rem;
  }
`;

export const WeatherForm = styled.form`
  display: flex;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

export const WeatherInput = styled(motion.input)`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px 0 0 4px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }
`;

export const WeatherButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    border-radius: 4px;
  }
`;

export const WeatherSuggestions = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  z-index: 10;
  left: 0;
  right: 0;
  top: 100%;
  margin-top: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.secondary} ${({ theme }) => theme.colors.cardBackground};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.cardBackground};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 4px;
    border: 2px solid ${({ theme }) => theme.colors.cardBackground};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    position: static;
    margin-top: 0.5rem;
  }
`;

export const WeatherSuggestion = styled(motion.div)`
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const WeatherInfo = styled.div`
  text-align: center;
`;

export const WeatherTemp = styled.h2`
  font-size: 2.5rem;
  margin: 1rem 0;
`;

export const WeatherDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

export const WeatherLocation = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;