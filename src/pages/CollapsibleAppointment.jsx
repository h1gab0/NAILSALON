import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const CollapsibleContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
`;

const AppointmentHeader = styled.div`
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AppointmentDetails = styled(motion.div)`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const CollapsibleAppointment = ({ appointment, onCancel, onMarkAsComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <CollapsibleContainer>
      <AppointmentHeader onClick={() => setIsExpanded(!isExpanded)}>
        <span><strong>{appointment.clientName}</strong> - {appointment.startTime}</span>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </AppointmentHeader>
      <AnimatePresence>
        {isExpanded && (
          <AppointmentDetails
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <p>Phone: {appointment.phone}</p>
            <p>Status: {appointment.status}</p>
            {appointment.status !== 'completed' && (
                <Button onClick={() => onMarkAsComplete(appointment)}>Mark as Complete</Button>
            )}
            <Button onClick={() => onCancel(appointment.id)} style={{backgroundColor: '#c0392b'}}>Cancel</Button>
          </AppointmentDetails>
        )}
      </AnimatePresence>
    </CollapsibleContainer>
  );
};

export default CollapsibleAppointment;