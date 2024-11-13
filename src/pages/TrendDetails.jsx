import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPaintBrush, FaPalette, FaGem, FaLeaf, FaMagic, FaRegClock, FaDollarSign, FaStar } from 'react-icons/fa';

const TrendDetailsContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeroSection = styled.div`
  position: relative;
  height: 40vh;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}20,
    ${({ theme }) => theme.colors.secondary}30
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const HeroContent = styled(motion.div)`
  text-align: center;
  z-index: 2;
`;

const TrendIcon = styled(motion.div)`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const TrendTitle = styled(motion.h1)`
  font-size: 3.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: -60px auto 0;
  padding: 2rem;
  position: relative;
  z-index: 3;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const Card = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TrendDescription = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.8;
  margin-bottom: 2rem;
  text-align: center;
`;

const QuickInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const QuickInfoCard = styled(motion.div)`
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.medium};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.small};

  svg {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.5rem;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const DetailCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radii.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const DetailTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  font-weight: bold;
`;

const DetailDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const trends = [
  {
    id: 0,
    title: "Minimalist Designs",
    description: "Clean lines and subtle patterns for a sophisticated look. Perfect for professional settings.",
    icon: FaPaintBrush,
    details: [
      "Simple geometric patterns",
      "Single-line designs",
      "Negative space techniques",
      "Monochromatic color schemes"
    ]
  },
  {
    id: 1,
    title: "Pastel Palette",
    description: "Soft, dreamy colors perfect for any season. Great for weddings and special events.",
    icon: FaPalette,
    details: [
      "Soft color combinations",
      "Gradient techniques",
      "Watercolor effects",
      "Marble patterns"
    ]
  },
  {
    id: 2,
    title: "Advanced Nail Art",
    description: "Intricate designs that showcase the pinnacle of nail artistry. Perfect for special occasions.",
    icon: FaGem,
    details: [
      "3D embellishments",
      "Hand-painted designs",
      "Chrome effects",
      "Mixed media art"
    ]
  },
  {
    id: 3,
    title: "Eco-Friendly Products",
    description: "Sustainable and non-toxic options for environmentally conscious clients.",
    icon: FaLeaf,
    details: [
      "Non-toxic formulas",
      "Vegan options",
      "Natural materials",
      "Green packaging"
    ]
  },
  {
    id: 4,
    title: "Nail Health & Care",
    description: "Expert advice and techniques for maintaining strong, healthy nails.",
    icon: FaMagic,
    details: [
      "Strengthening care",
      "Cuticle treatment",
      "Long-lasting tips",
      "Natural protection"
    ]
  }
];

function TrendDetails() {
  const { id } = useParams();
  const trendIndex = parseInt(id);
  const trend = trends[trendIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!trend) {
    return (
      <TrendDetailsContainer>
        <HeroSection>
          <TrendTitle>Trend Not Found</TrendTitle>
        </HeroSection>
      </TrendDetailsContainer>
    );
  }

  const TrendIconComponent = trend.icon;

  return (
    <TrendDetailsContainer>
      <HeroSection>
        <HeroContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TrendIcon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TrendIconComponent />
          </TrendIcon>
          <TrendTitle>{trend.title}</TrendTitle>
        </HeroContent>
      </HeroSection>

      <ContentWrapper>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TrendDescription>{trend.description}</TrendDescription>
          
          <QuickInfoGrid>
            <QuickInfoCard whileHover={{ scale: 1.05 }}>
              <FaRegClock />
              <h3>Duration</h3>
              <p>45-60 minutes</p>
            </QuickInfoCard>
            <QuickInfoCard whileHover={{ scale: 1.05 }}>
              <FaDollarSign />
              <h3>Starting at</h3>
              <p>$45</p>
            </QuickInfoCard>
            <QuickInfoCard whileHover={{ scale: 1.05 }}>
              <FaStar />
              <h3>Popularity</h3>
              <p>Top Choice</p>
            </QuickInfoCard>
          </QuickInfoGrid>

          <DetailGrid>
            {trend.details.map((detail, index) => (
              <DetailCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <DetailTitle>Feature {index + 1}</DetailTitle>
                <DetailDescription>{detail}</DetailDescription>
              </DetailCard>
            ))}
          </DetailGrid>
        </Card>
      </ContentWrapper>
    </TrendDetailsContainer>
  );
}

export default TrendDetails; 