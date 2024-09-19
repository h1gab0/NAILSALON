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

const ExpandButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
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
  margin-top: 0.5rem;
`;

const NoteContainer = styled.div`
  margin-bottom: 1rem;
`;

const NoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`;

const RemoveNoteButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
`;

const CollapsibleAppointment = ({ appointment, onAddNote, onRemoveNote, onCancel, onComplete, onDownloadImage }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <CollapsibleContainer>
      <AppointmentHeader onClick={() => setIsExpanded(!isExpanded)}>
        <div>
          <strong>{appointment.clientName}</strong> - {appointment.date} {appointment.time}
        </div>
        <ExpandButton>{isExpanded ? '▲' : '▼'}</ExpandButton>
      </AppointmentHeader>
      <AnimatePresence>
        {isExpanded && (
          <AppointmentDetails
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>Phone: {appointment.phone}</p>
            <p>Status: {appointment.status}</p>
            {appointment.status === 'completed' && (
              <>
                <p>Profit: {appointment.profit}</p>
                <p>Materials: {appointment.materials}</p>
              </>
            )}
            {appointment.image && (
              <div>
                <p>Inspiration Image:</p>
                <img src={appointment.image} alt="Inspiration" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                <Button onClick={() => onDownloadImage(appointment.image)}>Download Image</Button>
              </div>
            )}
            <NoteContainer>
              {appointment.notes && appointment.notes.map((note, index) => (
                <NoteItem key={index}>
                  <span>{note}</span>
                  <RemoveNoteButton onClick={() => onRemoveNote(appointment.id, index)}>Remove</RemoveNoteButton>
                </NoteItem>
              ))}
            </NoteContainer>
            <Button onClick={() => onAddNote(appointment.id, prompt('Enter note:'))}>Add Note</Button>
            <Button onClick={() => onCancel(appointment.id)}>Cancel</Button>
            {appointment.status !== 'completed' && (
              <Button onClick={() => {
                const profit = prompt('Enter profit:');
                const materials = prompt('Enter materials used:');
                onComplete(appointment.id, profit, materials);
              }}>Mark as Complete</Button>
            )}
          </AppointmentDetails>
        )}
      </AnimatePresence>
    </CollapsibleContainer>
  );
};

export default CollapsibleAppointment;