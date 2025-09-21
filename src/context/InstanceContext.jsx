import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

const InstanceContext = createContext(null);

export const useInstance = () => {
    return useContext(InstanceContext);
};

export const InstanceProvider = ({ children }) => {
    const { instanceId } = useParams();
    const id = instanceId || 'default'; // Fallback to 'default' if no instanceId is in the URL

    return (
        <InstanceContext.Provider value={{ instanceId: id }}>
            {children}
        </InstanceContext.Provider>
    );
};
