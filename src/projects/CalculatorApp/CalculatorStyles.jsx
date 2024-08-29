import styled from 'styled-components';
import { motion } from 'framer-motion';

export const CalculatorContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  margin: 0 auto;
`;

export const Display = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem;
  font-size: 1.5rem;
  text-align: right;
  margin-bottom: 1rem;
  border-radius: 4px;
  min-height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

export const Button = styled(motion.button)`
  padding: 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 4px;
  background-color: ${({ theme, operator }) => operator ? theme.colors.primary : theme.colors.secondary};
  color: white;
  cursor: pointer;
`;