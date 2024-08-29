import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ToggleContainer = styled(motion.button)`
  background: ${({ theme }) => theme.colors.toggleBackground};
  border: 2px solid ${({ theme }) => theme.colors.toggleBorder};
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  width: 4rem;
  height: 2rem;
  transition: all 0.3s linear;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 3.5rem;
    height: 1.75rem;
  }
`;

const Icon = styled(motion.svg)`
  height: 1rem;
  width: 1rem;
  color: ${({ theme }) => theme.colors.toggleIcon};
`;

// Use React.memo to prevent unnecessary re-renders
const ThemeToggle = React.memo(() => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Move variants outside of the component to prevent recreating on each render
  const toggleVariants = {
    light: { backgroundColor: '#f0f0f0' },
    dark: { backgroundColor: '#333333' },
  };

  const iconVariants = {
    light: { rotate: 0 },
    dark: { rotate: 360 },
  };

  const sunMoonVariants = {
    light: { scale: 1, opacity: 1 },
    dark: { scale: 0, opacity: 0 },
  };

  return (
    <ToggleContainer
      onClick={toggleTheme}
      animate={isDarkMode ? 'dark' : 'light'}
      variants={toggleVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <Icon
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={isDarkMode ? 'dark' : 'light'}
        variants={iconVariants}
        transition={{ duration: 0.5 }}
      >
        <motion.circle cx="12" cy="12" r="5" variants={sunMoonVariants} />
        <motion.line x1="12" y1="1" x2="12" y2="3" variants={sunMoonVariants} />
        <motion.line x1="12" y1="21" x2="12" y2="23" variants={sunMoonVariants} />
        <motion.line x1="4.22" y1="4.22" x2="5.64" y2="5.64" variants={sunMoonVariants} />
        <motion.line x1="18.36" y1="18.36" x2="19.78" y2="19.78" variants={sunMoonVariants} />
        <motion.line x1="1" y1="12" x2="3" y2="12" variants={sunMoonVariants} />
        <motion.line x1="21" y1="12" x2="23" y2="12" variants={sunMoonVariants} />
        <motion.line x1="4.22" y1="19.78" x2="5.64" y2="18.36" variants={sunMoonVariants} />
        <motion.line x1="18.36" y1="5.64" x2="19.78" y2="4.22" variants={sunMoonVariants} />
      </Icon>
      <Icon
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={isDarkMode ? 'dark' : 'light'}
        variants={iconVariants}
        transition={{ duration: 0.5 }}
      >
        <motion.path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          variants={{
            light: { scale: 0, opacity: 0 },
            dark: { scale: 1, opacity: 1 },
          }}
        />
      </Icon>
    </ToggleContainer>
  );
});

export default ThemeToggle;