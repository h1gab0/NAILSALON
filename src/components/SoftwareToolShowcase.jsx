// File: components/SoftwareToolShowcase.jsx

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTasks, FaCalculator, FaCloudSun, FaBoxOpen, FaShoppingCart } from 'react-icons/fa';

const ShowcaseContainer = styled(motion.section)`
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const ToolGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 900px;
  width: 100%;
`;

const ToolCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ToolIcon = styled(motion.div)`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const ToolTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ToolDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ToolLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const tools = [
  {
    id: 'task-manager',
    title: 'Task Manager',
    description: 'Organize and manage your tasks with our intuitive task management tool.',
    icon: FaTasks,
  },
  {
    id: 'calculator',
    title: 'Calculator',
    description: 'Perform basic and advanced calculations with our sleek calculator app.',
    icon: FaCalculator,
  },
  {
    id: 'weather-app',
    title: 'Weather App',
    description: 'Check real-time weather information for any location with our weather app.',
    icon: FaCloudSun,
  },
  {
    id: 'inventory-control',
    title: 'Inventory Control',
    description: 'Manage your inventory efficiently with our comprehensive inventory control tool.',
    icon: FaBoxOpen,
  },
  {
    id: 'retail-order-system',
    title: 'Retail Order System',
    description: 'Handle retail orders and track your inventory with our streamlined order management system.',
    icon: FaShoppingCart,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function SoftwareToolShowcase() {
  return (
    <ShowcaseContainer variants={containerVariants} initial="hidden" animate="visible">
      <Title variants={itemVariants}>Our Software Tools</Title>
      <ToolGrid variants={containerVariants}>
        {tools.map((tool) => (
          <ToolCard key={tool.id} variants={itemVariants} whileHover={{ scale: 1.05 }}>
            <ToolIcon as={motion.div} whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <tool.icon />
            </ToolIcon>
            <ToolTitle>{tool.title}</ToolTitle>
            <ToolDescription>{tool.description}</ToolDescription>
            <ToolLink to={`/project-showcase/${tool.id}`}>Learn More</ToolLink>
          </ToolCard>
        ))}
      </ToolGrid>
    </ShowcaseContainer>
  );
}

export default SoftwareToolShowcase;