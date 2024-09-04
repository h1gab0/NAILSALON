const baseTheme = {
  fonts: {
    body: '"Inter", sans-serif',
    heading: '"Poppins", sans-serif',
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  transitions: {
    default: '0.3s ease-in-out',
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
};

export const lightTheme = {
  ...baseTheme,
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#f8f9fa',
    cardBackground: '#ffffff',
    text: '#2c3e50',
    subtext: '#7f8c8d',
    headerBackground: '#ffffff',
    border: '#e0e0e0',
    hover: '#ecf0f1',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#6c5ce7',
    secondary: '#00b894',
    background: '#2d3436',
    cardBackground: '#34495e',
    text: '#ecf0f1',
    subtext: '#bdc3c7',
    headerBackground: '#1e272e',
    border: '#4a4a4a',
    hover: '#3d3d3d',
    success: '#55efc4',
    warning: '#ffeaa7',
    error: '#ff7675',
  },
};