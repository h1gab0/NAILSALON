// header.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.headerBackground};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1001;
`;

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background-color: ${({ theme }) => `${theme.colors.headerBackground}f0`};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding-top: calc(60px + 1rem);
  z-index: 998;
  border-top: 1px solid ${({ theme }) => `${theme.colors.border}30`};
  box-shadow: ${({ theme }) => theme.shadows.medium};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    &:after {
      width: 100%;
    }
  }
`;

const ScheduleButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.medium};
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    background-color: ${({ theme }) => theme.colors.secondary};

    &:before {
      width: 300%;
      height: 300%;
    }
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
  }
`;


const ThemeToggleWrapper = styled.div`
  margin-left: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    margin-top: 1rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  padding: 1rem;
  width: 100%;
  text-align: center;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.cardBackground};
  }
`;

const MobileScheduleButton = styled(Link)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.radii.medium};
  font-weight: bold;
  width: 90%;
  text-align: center;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleClickOutside = useCallback((event) => {
    if (isMenuOpen && !event.target.closest('nav') && !event.target.closest('.theme-toggle')) {
      closeMenu();
    }
  }, [isMenuOpen, closeMenu]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const scrollToTop = useCallback((e) => {
    e.preventDefault();
    
    // If we're on the home page, scroll to top
    if (location.pathname === '/') {
      document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we're on any other page, navigate to home and scroll to top
      navigate('/');
      window.scrollTo(0, 0);
    }
    closeMenu();
  }, [location.pathname, navigate, closeMenu]);

  const handleScheduleClick = useCallback((e) => {
    e.preventDefault();
    navigate('/schedule');
    window.scrollTo(0, 0);
    closeMenu();
  }, [navigate, closeMenu]);

  return (
    <StyledHeader>
      <Nav>
        <Logo to="/" onClick={scrollToTop}>Nail Salon Scheduler</Logo>
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
        <NavLinks>
          <NavLink to="/" onClick={scrollToTop}>Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/gallery">Nail Gallery</NavLink>
          <ScheduleButton
            to="/schedule"
            onClick={handleScheduleClick}
            aria-label="Schedule an appointment"
          >
            Schedule Appointment
          </ScheduleButton>
          <ThemeToggleWrapper>
            <ThemeToggle />
          </ThemeToggleWrapper>
        </NavLinks>
      </Nav>
      <AnimatePresence>
        {isMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MobileNavLink to="/" onClick={scrollToTop}>Home</MobileNavLink>
            <MobileNavLink to="/services" onClick={closeMenu}>Services</MobileNavLink>
            <MobileNavLink to="/gallery" onClick={closeMenu}>Nail Gallery</MobileNavLink>
            <MobileScheduleButton 
              to="/schedule" 
              onClick={handleScheduleClick}
              aria-label="Schedule an appointment"
            >
              Schedule Appointment
            </MobileScheduleButton>
            <ThemeToggleWrapper className="theme-toggle">
              <ThemeToggle />
            </ThemeToggleWrapper>
          </MobileMenu>
        )}
      </AnimatePresence>
    </StyledHeader>
  );
}

export default Header;