import React from 'react';
import { FilterContainer as StyledFilterContainer, FilterButton } from './StyledComponents';

function FilterContainer({ filter, setFilter }) {
  return (
    <StyledFilterContainer>
      <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
      <FilterButton active={filter === 'active'} onClick={() => setFilter('active')}>Active</FilterButton>
      <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')}>Completed</FilterButton>
    </StyledFilterContainer>
  );
}

export default FilterContainer;