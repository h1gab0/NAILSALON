import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 3rem;
  background: linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: none;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    pointer-events: none;
    transition: all 0.5s ease;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    &:before {
      left: 100%;
    }
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials against a backend
    if (username === 'admin' && password === 'password') {
      login({ username, role: 'admin' });
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <LoginContainer>
      <Title>Login</Title>
      <LoginForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;