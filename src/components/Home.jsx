import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  background-image: url('/images/elegant-nails-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: #fff;
  font-family: 'Playfair Display', serif;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #f0f0f0;
  font-family: 'Montserrat', sans-serif;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.2rem;
  }
`;

const CallToAction = styled(motion(Link))`
  padding: 0.75rem 1.5rem;
  background-color: #f7d1ba;
  color: #333;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-family: 'Montserrat', sans-serif;

  &:hover {
    background-color: #f9a789;
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
