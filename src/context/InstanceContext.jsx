import React, { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const InstanceContext = createContext(null);

export const useInstance = () => {
  const context = useContext(InstanceContext);
  if (!context) {
    throw new Error('useInstance must be used within an InstanceProvider');
  }
  return context;
};

export const InstanceProvider = ({ children }) => {
  const { instanceId } = useParams();

  const value = useMemo(() => ({
    instanceId: instanceId || 'default',
  }), [instanceId]);

  return (
    <InstanceContext.Provider value={value}>
      {children}
    </InstanceContext.Provider>
  );
};