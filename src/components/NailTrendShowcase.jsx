import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPaintBrush, FaPalette } from 'react-icons/fa';

const ShowcaseContainer = styled(motion.section)`
  padding: 5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const TrendGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  width: 100%;
  padding: 0 2rem;
`;

const TrendCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.medium};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TrendIcon = styled(motion.div)`
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

const TrendImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radii.medium};
  margin-bottom: 1.5rem;
`;

const trends = [
  {
    id: 'minimalist-designs',
    title: 'Minimalist Designs',
    description: 'Clean lines and subtle patterns for a sophisticated look.',
    icon: FaPaintBrush,
    image: '/images/minimalist-nails.jpg',
  },
  {
    id: 'pastel-palette',
    title: 'Pastel Palette',
    description: 'Soft, dreamy colors perfect for any season.',
    icon: FaPalette,
    image: '/images/pastel-nails.jpg',
  },
];

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
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function NailTrendShowcase() {
  return (
    <ShowcaseContainer variants={containerVariants} initial="hidden" animate="visible">
      <Title variants={itemVariants}>Trending Nail Styles</Title>
      <TrendGrid variants={containerVariants}>
        {trends.map((trend) => (
          <TrendCard 
            key={trend.id} 
            variants={itemVariants} 
            whileHover={{ 
              scale: 1.03, 
              boxShadow: (theme) => theme.shadows.large,
              transition: { duration: 0.3 }
            }}
          >
            <TrendIcon 
              as={motion.div} 
              whileHover={{ rotate: 360, scale: 1.1 }} 
              transition={{ duration: 0.5 }}
            >
              <trend.icon />
            </TrendIcon>
            <TrendTitle>{trend.title}</TrendTitle>
            <TrendImage src={trend.image} alt={trend.title} />
            <TrendDescription>{trend.description}</TrendDescription>
          </TrendCard>
        ))}
      </TrendGrid>
    </ShowcaseContainer>
  );
}

export default NailTrendShowcase;