import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  transition: all ${({ theme }) => theme.transitions.default};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.radii.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.medium};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.subtext};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radii.medium};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/admin');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Admin Login</Title>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Button type="submit">Login</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginComponent;