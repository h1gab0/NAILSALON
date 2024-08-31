// File: components/Header.jsx

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.headerBackground};
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
`;

const NavLinks = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
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

const MobileMenu = styled(motion.div)`
  display: none;
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.headerBackground};
  padding: 1rem;
  z-index: 999;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
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

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <StyledHeader>
      <Nav>
        <Logo to="/" onClick={closeMenu}>Nail Salon Scheduler</Logo>
        <MenuButton onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </MenuButton>
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/schedule">Schedule Appointment</NavLink>
          <NavLink to="/admin">Admin Dashboard</NavLink>
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
            <MobileNavLink to="/" onClick={closeMenu}>Home</MobileNavLink>
            <MobileNavLink to="/schedule" onClick={closeMenu}>Schedule Appointment</MobileNavLink>
            <MobileNavLink to="/admin" onClick={closeMenu}>Admin Dashboard</MobileNavLink>
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