import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TableContainer = styled(motion.div)`
  overflow-x: auto;
  margin: 2rem 0;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled(motion.table)`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Td = styled(motion.td)`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Tr = styled(motion.tr)`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.cardBackground};
  }
`;

const features = [
  { name: 'Task Management', tool1: '✓', tool2: '✓', tool3: '✓' },
  { name: 'Time Tracking', tool1: '✓', tool2: '✘', tool3: '✓' },
  { name: 'Collaboration', tool1: '✓', tool2: '✓', tool3: '✓' },
  { name: 'Reporting', tool1: '✓', tool2: '✓', tool3: '✘' },
  { name: 'Mobile App', tool1: '✓', tool2: '✘', tool3: '✓' },
];

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

function ComparisonTable() {
  return (
    <TableContainer initial="hidden" animate="visible" variants={tableVariants}>
      <Table>
        <thead>
          <Tr variants={rowVariants}>
            <Th>Feature</Th>
            <Th>Our Tool</Th>
            <Th>Competitor A</Th>
            <Th>Competitor B</Th>
          </Tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <Tr key={index} variants={rowVariants}>
              <Td>{feature.name}</Td>
              <Td>{feature.tool1}</Td>
              <Td>{feature.tool2}</Td>
              <Td>{feature.tool3}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default ComparisonTable;