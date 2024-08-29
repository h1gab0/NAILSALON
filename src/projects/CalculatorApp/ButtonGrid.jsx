import React from 'react';
import { ButtonGrid as StyledButtonGrid } from './CalculatorStyles';
import Button from './Button';

function ButtonGrid({ inputDigit, inputDecimal, clear, performOperation }) {
  return (
    <StyledButtonGrid>
      <Button onClick={() => inputDigit(7)}>7</Button>
      <Button onClick={() => inputDigit(8)}>8</Button>
      <Button onClick={() => inputDigit(9)}>9</Button>
      <Button onClick={() => performOperation('/')} operator>/</Button>
      <Button onClick={() => inputDigit(4)}>4</Button>
      <Button onClick={() => inputDigit(5)}>5</Button>
      <Button onClick={() => inputDigit(6)}>6</Button>
      <Button onClick={() => performOperation('*')} operator>*</Button>
      <Button onClick={() => inputDigit(1)}>1</Button>
      <Button onClick={() => inputDigit(2)}>2</Button>
      <Button onClick={() => inputDigit(3)}>3</Button>
      <Button onClick={() => performOperation('-')} operator>-</Button>
      <Button onClick={() => inputDigit(0)}>0</Button>
      <Button onClick={inputDecimal}>.</Button>
      <Button onClick={() => performOperation('=')}>=</Button>
      <Button onClick={() => performOperation('+')} operator>+</Button>
      <Button onClick={clear} style={{ gridColumn: 'span 4' }}>Clear</Button>
    </StyledButtonGrid>
  );
}

export default ButtonGrid;