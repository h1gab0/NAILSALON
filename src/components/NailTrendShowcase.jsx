import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaintBrush, FaPalette, FaGem, FaLeaf, FaMagic, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ShowcaseContainer = styled.section`
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 500px;
  touch-action: pan-y;
`;

const TrendCard = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.medium};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TrendIcon = styled.div`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const TrendTitle = styled.h3`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const TrendDescription = styled.p`
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.subtext};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const StyledImage = styled.div`
  width: 100%;
  height: 250px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.medium};
  margin-bottom: 1.5rem;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  &:focus {
    outline: none;
  }

  &.left {
    left: 10px;
  }

  &.right {
    right: 10px;
  }
`;

const IndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Indicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.subtext};
  margin: 0 5px;
  transition: background 0.3s;
  cursor: pointer;
`;

const trends = [
  {
    id: 'minimalist-designs',
    title: 'Minimalist Designs',
    description: 'Clean lines and subtle patterns for a sophisticated look. Perfect for professional settings.',
    icon: FaPaintBrush,
  },
  {
    id: 'pastel-palette',
    title: 'Pastel Palette',
    description: 'Soft, dreamy colors perfect for any season. Great for weddings and special events.',
    icon: FaPalette,
  },
  {
    id: 'nail-art-techniques',
    title: 'Advanced Nail Art Techniques',
    description: 'Learn intricate designs to wow your clients and stand out in the industry.',
    icon: FaGem,
  },
  {
    id: 'eco-friendly-products',
    title: 'Eco-Friendly Nail Products',
    description: 'Sustainable and non-toxic options for environmentally conscious clients.',
    icon: FaLeaf,
  },
  {
    id: 'nail-health-tips',
    title: 'Nail Health & Maintenance',
    description: 'Advice on maintaining strong, healthy nails to share with your clients.',
    icon: FaMagic,
  },
];


function NailTrendShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trends.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + trends.length) % trends.length);
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide]);

  const handleManualInteraction = useCallback(() => {
    setIsAutoPlay(false);
    // Restart autoplay after 10 seconds of inactivity
    const timeout = setTimeout(() => setIsAutoPlay(true), 10000);
    return () => clearTimeout(timeout);
  }, []);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
    handleManualInteraction();
  }, [handleManualInteraction]);

  const handleTouchMove = useCallback((e) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum distance to be considered a swipe

    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  }, [nextSlide, prevSlide]);

  const handleIndicatorClick = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    handleManualInteraction();
  }, [currentIndex, handleManualInteraction]);

  const CurrentIcon = trends[currentIndex].icon;

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <ShowcaseContainer>
      <Title>Trending Nail Styles</Title>
      <CarouselWrapper
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ArrowButton className="left" onClick={() => { prevSlide(); handleManualInteraction(); }}>
          <FaChevronLeft />
        </ArrowButton>
        <ArrowButton className="right" onClick={() => { nextSlide(); handleManualInteraction(); }}>
          <FaChevronRight />
        </ArrowButton>
        <AnimatePresence initial={false} custom={direction}>
          <TrendCard
            key={trends[currentIndex].id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <TrendIcon>
              <CurrentIcon />
            </TrendIcon>
            <TrendTitle>{trends[currentIndex].title}</TrendTitle>
            <StyledImage />
            <TrendDescription>{trends[currentIndex].description}</TrendDescription>
          </TrendCard>
        </AnimatePresence>
      </CarouselWrapper>
      <IndicatorWrapper>
        {trends.map((_, index) => (
          <Indicator
            key={index}
            isActive={index === currentIndex}
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </IndicatorWrapper>
    </ShowcaseContainer>
  );
}

export default NailTrendShowcase;