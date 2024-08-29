import styled from 'styled-components';
import { motion } from 'framer-motion';

export const InventoryContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const Form = styled.form`
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
`;

export const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
  }
`;

export const Thead = styled.thead`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

export const Tbody = styled.tbody`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
  }
`;

export const Tr = styled.tr`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 4px;
    padding: 0.5rem;
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.secondary};
`;

export const Td = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    padding: 0.25rem 0;
    border: none;

    &:before {
      content: attr(data-label);
      font-weight: bold;
      width: 40%;
      margin-right: 0.5rem;
    }
  }
`;