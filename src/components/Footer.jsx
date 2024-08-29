import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary};
`;

function Footer() {
  return (
    <StyledFooter>
      <p>&copy; 2024 My Portfolio. All rights reserved.</p>
    </StyledFooter>
  );
}

export default Footer;