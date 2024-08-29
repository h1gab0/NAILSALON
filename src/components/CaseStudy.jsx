import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CaseStudyContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 2rem;
  margin: 2rem 0;
  color: ${({ theme }) => theme.colors.text};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1rem;
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const ResultItem = styled(motion.li)`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  &:before {
    content: '✓';
    color: ${({ theme }) => theme.colors.primary};
    margin-right: 0.5rem;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

const Description = styled.p`
  margin-bottom: 1rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 0.9rem;
  }
`;

const Results = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

function CaseStudy({ title, description, results }) {
  return (
    <CaseStudyContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Results>
        {results.map((result, index) => (
          <ResultItem
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {result}
          </ResultItem>
        ))}
      </Results>
    </CaseStudyContainer>
  );
}

export default CaseStudy;