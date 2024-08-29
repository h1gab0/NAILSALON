import React from 'react';
import { Button as StyledButton } from './CalculatorStyles';

function Button({ children, onClick, operator, style }) {
  return (
    <StyledButton
      onClick={onClick}
      operator={operator}
      style={style}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </StyledButton>
  );
}

export default Button;