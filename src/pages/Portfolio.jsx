import React from 'react';
import styled from 'styled-components';
import SoftwareToolShowcase from '../components/SoftwareToolShowcase';
import ComparisonTable from '../components/ComparisonTable';
import CaseStudy from '../components/CaseStudy';

const PortfolioContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

export default function Portfolio() {
  return (
    <PortfolioContainer>
      <Title>Our Software Portfolio</Title>
      <SoftwareToolShowcase />
      <ComparisonTable />
      <CaseStudy
        title="Success Story: XYZ Company"
        description="XYZ Company implemented our project management tool and saw significant improvements in their workflow and productivity."
        results={[
          'Reduced project completion time by 30%',
          'Improved team collaboration and communication',
          'Increased customer satisfaction by 25%',
        ]}
      />
    </PortfolioContainer>
  );
}