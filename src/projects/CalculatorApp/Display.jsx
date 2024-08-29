import React from 'react';
import { Display as StyledDisplay } from './CalculatorStyles';

function Display({ value }) {
  return <StyledDisplay>{value}</StyledDisplay>;
}

export default Display;
