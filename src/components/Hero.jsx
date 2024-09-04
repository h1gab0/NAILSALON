import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background-image: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(rgba(26, 26, 26, 0.7), rgba(26, 26, 26, 0.7)), url("/images/elegant-nails-bg-dark.jpg")'
    : 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url("/images/elegant-nails-bg-light.jpg")'};
  background-size: cover;
  background-position: center;
  transition: all ${({ theme }) => theme.transitions.default};
  padding-top: 60px; // Add padding to account for the fixed header
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.subtext};
  font-family: ${({ theme }) => theme.fonts.body};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.2rem;
  }
`;

const CallToAction = styled(motion(Link))`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.isDark ? theme.colors.text : theme.colors.background};
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-family: ${({ theme }) => theme.fonts.body};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Hero() {
  return (
    <HeroContainer as={motion.section} variants={containerVariants} initial="hidden" animate="visible">
      <Content>
        <Title variants={itemVariants}>
          Elegance at Your Fingertips
        </Title>
        <Subtitle variants={itemVariants}>
          Experience luxury nail care in the heart of the city
        </Subtitle>
        <CallToAction
          to="/book-appointment"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Book Your Appointment
        </CallToAction>
      </Content>
    </HeroContainer>
  );
}

export default Hero;