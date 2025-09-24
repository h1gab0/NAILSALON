import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { useInstance } from '../context/InstanceContext';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
`;

const Login = ({ superAdmin = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { instanceId } = useInstance();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = superAdmin
      ? '/api/super-admin/login'
      : `/api/instances/${instanceId}/login`;

    const payload = { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const user = {
            username,
            role: superAdmin ? 'superadmin' : 'admin',
            instanceId: superAdmin ? null : instanceId
        };
        login(user);

        if (superAdmin) {
            navigate('/super-admin');
        } else {
            navigate(`/${instanceId}/admin`);
        }
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <LoginContainer>
      <Title>{superAdmin ? 'Super Admin Login' : 'Admin Login'}</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </LoginContainer>
  );
};

export default Login;