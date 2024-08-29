import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ProjectContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const TaskInput = styled(motion.input)`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const TaskListContainer = styled(motion.div)`
  width: 100%;
  overflow: hidden;
`;

export const TaskList = styled(motion.ul)`
  list-style-type: none;
  padding: 0;
  width: 100%;
  margin: 0;
`;

export const TaskItem = styled(motion.li)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TaskCheckbox = styled(motion.input)`
  margin-right: 0.5rem;
  cursor: pointer;
`;

export const TaskText = styled(motion.span)`
  flex-grow: 1;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  color: ${props => props.completed ? props.theme.colors.secondary : props.theme.colors.text};
  transition: all 0.3s ease;
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ActionButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  padding: 0.2rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const AddTaskButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

export const FilterButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;