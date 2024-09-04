import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      font-size: 14px;
    }
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    transition: all ${({ theme }) => theme.transitions.default};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    margin-bottom: 1.5rem;
    line-height: 1.2;
    font-weight: 600;
  }

  p {
    margin-bottom: 1.5rem;
  }

  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.body};
    transition: all ${({ theme }) => theme.transitions.default};
    padding: 0.5rem 1rem;
    border: none;
    border-radius: ${({ theme }) => theme.radii.small};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .section {
    padding: 5rem 0;

    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      padding: 4rem 0;
    }
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.radii.small};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

export default GlobalStyles;