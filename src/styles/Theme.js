// File: styles/Theme.js

const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

const baseTheme = {
  fonts: {
    body: '"Open Sans", sans-serif',
    heading: '"Montserrat", sans-serif',
  },
  breakpoints,
  transitions: {
    default: '0.3s ease-in-out',
  },
};

const lightColors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#f5f5f5',
  text: '#333333',
  cardBackground: '#ffffff',
  headerBackground: '#ffffff',
  toggleBackground: '#f0f0f0',
  toggleBorder: '#3498db',
  toggleIcon: '#3498db',
};

const darkColors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  background: '#2c3e50',
  text: '#ecf0f1',
  cardBackground: '#34495e',
  headerBackground: '#2c3e50',
  toggleBackground: '#34495e',
  toggleBorder: '#3498db',
  toggleIcon: '#ecf0f1',
};

export const lightTheme = { ...baseTheme, colors: lightColors };
export const darkTheme = { ...baseTheme, colors: darkColors };