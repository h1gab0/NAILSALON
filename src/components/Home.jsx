import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ExploreButton = styled(Link)`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: 5px;
`;

function Home() {
  return (
    <div>
      <h1>Welcome to My Software Portfolio</h1>
      <ExploreButton to="/portfolio">Explore My Tools</ExploreButton>
    </div>
  );
}

export default Home;