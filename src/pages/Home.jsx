import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import SoftwareToolShowcase from '../components/SoftwareToolShowcase';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export default function Home() {
  return (
    <HomeContainer>
      <Hero />
      <SoftwareToolShowcase />
    </HomeContainer>
  );
}