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
    primary: '#FF69B4', // Hot Pink
    secondary: '#FFC0CB', // Pink
    tertiary: '#FFB6C1', // Light Pink
    background: '#FFF0F5', // Lavender Blush
    cardBackground: '#FFFFFF',
    text: '#4B0082', // Indigo
    subtext: '#8E4585', // Dark Orchid
    headerBackground: '#FFFFFF',
    border: '#FFB6C1', // Light Pink
    hover: '#FFF0F5', // Lavender Blush
    success: '#98FB98', // Pale Green
    warning: '#FFFACD', // Lemon Chiffon
    error: '#FFB6C1', // Light Pink
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: '#FF1493', // Deep Pink
    secondary: '#FF69B4', // Hot Pink
    tertiary: '#DB7093', // Pale Violet Red
    background: '#4B0082', // Indigo
    cardBackground: '#8B008B', // Dark Magenta
    text: '#FFF0F5', // Lavender Blush
    subtext: '#DDA0DD', // Plum
    headerBackground: '#800080', // Purple
    border: '#C71585', // Medium Violet Red
    hover: '#9932CC', // Dark Orchid
    success: '#98FB98', // Pale Green
    warning: '#FFFACD', // Lemon Chiffon
    error: '#FFB6C1', // Light Pink
  },
};