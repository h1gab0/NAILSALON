// src/components/CollapsibleAppointment.jsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const CollapsibleContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const AppointmentHeader = styled.div`
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClientNameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ClientName = styled.strong`
  margin-right: 0.5rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  padding: 0;
  margin-right: 0.5rem;
`;

const NameInput = styled.input`
  padding: 0.25rem;
  margin-right: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
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

const WhatsAppButton = styled(Button)`
  background-color: #25D366;
  display: flex;
  align-items: center;
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

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

const InspirationImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-bottom: 0.5rem;
`;

const NoteInput = styled.input`
  flex: 1;
  padding: 0.25rem;
  margin-right: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const EditNoteButton = styled(RemoveNoteButton)`
  background-color: ${({ theme }) => theme.colors.primary};
  margin-right: 0.5rem;
`;

const CollapsibleAppointment = ({ appointment, onAddNote, onRemoveNote, onEditNote, onCancel, onComplete, onDownloadImage, onUpdateName }) => {
  const appointmentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(appointment.clientName);
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  const getWhatsAppLink = (phone, message) => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const sendAppointmentMessage = () => {
    const appointmentDetails = `Appointment Details:\nDate: ${appointment.date}\nTime: ${appointment.time}\nClient: ${appointment.clientName}`;
    const appointmentLink = getWhatsAppLink(appointment.phone, appointmentDetails);
    window.open(appointmentLink, '_blank');
  };

  const handleNameChange = (e) => {
    setEditableName(e.target.value);
  };

  const handleNameUpdate = () => {
    onUpdateName(appointment.id, editableName);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableName(appointment.clientName);
    setIsEditing(false);
  };

  const toggleExpand = (e) => {
    if (!isEditing) {
      setIsExpanded(!isExpanded);
      if (!isExpanded && appointmentRef.current) {
        setTimeout(() => {
          const element = appointmentRef.current;
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          
          const scrollPosition = absoluteElementTop + elementRect.height - window.innerHeight;
          
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
        }, 150);
      }
    }
    e.stopPropagation();
  };

  const handleCancelNoteEdit = () => {
    setEditingNoteIndex(null);
    setEditingNoteText('');
  };

  const handleStartEdit = (index, noteText) => {
    setEditingNoteIndex(index);
    setEditingNoteText(noteText);
  };

  const handleSaveEdit = (index) => {
    onEditNote(appointment.id, index, editingNoteText);
    setEditingNoteIndex(null);
    setEditingNoteText('');
  };

  return (
    <CollapsibleContainer ref={appointmentRef}>
      <AppointmentHeader onClick={toggleExpand}>
        <ClientNameContainer>
          {isEditing ? (
            <>
              <NameInput
                type="text"
                value={editableName}
                onChange={handleNameChange}
                onClick={(e) => e.stopPropagation()}
              />
              <EditButton onClick={handleNameUpdate}><FaCheck /></EditButton>
              <EditButton onClick={handleCancelEdit}><FaTimes /></EditButton>
            </>
          ) : (
            <>
              <ClientName>{appointment.clientName}</ClientName>
              <EditButton onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}><FaEdit /></EditButton>
            </>
          )}
          - {appointment.date} {appointment.time}
        </ClientNameContainer>
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
            {appointment.couponCode && <p>Coupon Used: <strong>{appointment.couponCode}</strong></p>}
            {appointment.status === 'completed' && (
              <>
                <p>Profit: {appointment.profit}</p>
                <p>Materials: {appointment.materials}</p>
              </>
            )}
            {appointment.image && (
              <ImageContainer>
                <p>Inspiration Image:</p>
                <InspirationImage src={appointment.image} alt="Inspiration" />
                <Button onClick={() => onDownloadImage(appointment.image)}>Download Image</Button>
              </ImageContainer>
            )}
            <NoteContainer>
              {appointment.notes && appointment.notes.map((note, index) => (
                <NoteItem key={index}>
                  {editingNoteIndex === index ? (
                    <>
                      <NoteInput
                        type="text"
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                      />
                      <EditNoteButton onClick={() => handleSaveEdit(index)}>
                        <FaCheck />
                      </EditNoteButton>
                      <RemoveNoteButton onClick={handleCancelNoteEdit}>
                        <FaTimes />
                      </RemoveNoteButton>
                    </>
                  ) : (
                    <>
                      <span>{note}</span>
                      <div>
                        <EditNoteButton onClick={() => handleStartEdit(index, note)}>
                          <FaEdit />
                        </EditNoteButton>
                        <RemoveNoteButton onClick={() => onRemoveNote(appointment.id, index)}>
                          <FaTimes />
                        </RemoveNoteButton>
                      </div>
                    </>
                  )}
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
            <WhatsAppButton onClick={sendAppointmentMessage}>
              <FaWhatsapp style={{ marginRight: '5px' }} />
              Send WhatsApp Message
            </WhatsAppButton>
          </AppointmentDetails>
        )}
      </AnimatePresence>
    </CollapsibleContainer>
  );
};

export default CollapsibleAppointment;