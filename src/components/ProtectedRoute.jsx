import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInstance } from '../context/InstanceContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoadingText = styled(motion.div)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

const loadingVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const { instanceId } = useInstance();

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingText
          variants={loadingVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.5 }}
        >
          Verifying access...
        </LoadingText>
      </LoadingWrapper>
    );
  }

  if (!isAuthenticated) {
    // If there's an instanceId, redirect to that instance's login page.
    // Otherwise, redirect to the super admin login.
    const loginPath = instanceId && instanceId !== 'default' ? `/${instanceId}/login` : '/login';
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;