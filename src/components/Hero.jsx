import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useInstance } from '../context/InstanceContext';

const HeroContainer = styled(motion.section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
  padding-top: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 0;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(45deg, ${({ theme }) => theme.colors.primary} 25%, transparent 25%),
                    linear-gradient(-45deg, ${({ theme }) => theme.colors.primary} 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, ${({ theme }) => theme.colors.primary} 75%),
                    linear-gradient(-45deg, transparent 75%, ${({ theme }) => theme.colors.primary} 75%);
  background-size: 20px 20px;
  opacity: 0.05;
`;

const Content = styled(motion.div)`
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 2rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.heading};
  cursor: default;
  user-select: none;
  
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

const CallToActionWrapper = styled(motion.div)`
  display: inline-block;
  position: relative;
`;

const CallToAction = styled(motion(Link))`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.medium};
  text-decoration: none;
  font-weight: bold;
  transition: all ${({ theme }) => theme.transitions.default};
  font-family: ${({ theme }) => theme.fonts.body};
  box-shadow: ${({ theme }) => theme.shadows.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

const Divider = styled(motion.div)`
  width: 60px;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.secondary};
  margin: 2rem auto;
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
  const { instanceId } = useInstance();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const base = instanceId === 'default' ? '' : `/${instanceId}`;

  const handleTitleClick = useCallback(() => {
    const currentTime = Date.now();
    
    if (currentTime - lastClickTime > 2000) {
      setClickCount(1);
    } else {
      setClickCount(prev => prev + 1);
    }
    
    setLastClickTime(currentTime);
  }, [lastClickTime]);

  useEffect(() => {
    if (clickCount === 7) {
      navigate(`${base}/admin`);
      setClickCount(0);
    }
  }, [clickCount, navigate, base]);

  const handleBooking = useCallback((e) => {
    e.preventDefault();
    navigate(`${base}/schedule`);
  }, [navigate, base]);

  return (
    <HeroContainer id="hero-section" variants={containerVariants} initial="hidden" animate="visible">
      <BackgroundPattern />
      <Content>
        <Title 
          variants={itemVariants}
          onClick={handleTitleClick}
          style={{ cursor: 'default' }}
        >
          Elegant Touch Nail Salon
        </Title>
        <Subtitle variants={itemVariants}>
          Where luxury meets artistry for your hands and feet
        </Subtitle>
        <Divider variants={itemVariants} />
        <CallToActionWrapper variants={itemVariants}>
          <CallToAction
            to={`${base}/schedule`}
            onClick={handleBooking}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Your Experience
          </CallToAction>
        </CallToActionWrapper>
      </Content>
    </HeroContainer>
  );
}

export default Hero;