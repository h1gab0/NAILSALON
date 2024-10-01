// src/components/Chat.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaWhatsapp } from 'react-icons/fa';

const ChatButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const WhatsAppIcon = styled(FaWhatsapp)`
  color: white;
  font-size: 30px;
`;

const AppointmentWhatsAppButton = styled.button`
  background-color: #25D366;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

function Chat({ appointment, onAddNote }) {
  const [chatSession, setChatSession] = useState([]);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const defaultMessage = 'Hola, vengo por tu página web.';

  const getWhatsAppLink = (phone, message) => {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const sendAppointmentMessage = () => {
    if (appointment) {
      const appointmentDetails = `Appointment Details:\nDate: ${appointment.date}\nTime: ${appointment.time}\nClient: ${appointment.clientName}`;
      const appointmentLink = getWhatsAppLink(appointment.phone, appointmentDetails);
      window.open(appointmentLink, '_blank');
    }
  };

  const analyzeChat = async () => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: 'Analyze the following chat session and synthesize requirements for a new note item.' },
            ...chatSession.map(msg => ({ role: 'user', content: msg }))
          ]
        })
      });

      const data = await response.json();
      const newNote = data.choices[0].message.content;

      onAddNote(appointment.id, newNote);

      setLastAnalysisTime(new Date());
    } catch (error) {
      console.error('Error analyzing chat:', error);
    }
  };

  useEffect(() => {
    let intervalId;

    if (isTracking) {
      intervalId = setInterval(() => {
        const currentTime = new Date();
        if (!lastAnalysisTime || (currentTime - lastAnalysisTime) >= 5 * 60 * 1000) {
          analyzeChat();
        }
      }, 60 * 1000); // Check every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTracking, lastAnalysisTime, chatSession, appointment, onAddNote]);

  const addMessageToChat = (message) => {
    setChatSession(prevSession => [...prevSession, message]);
    setIsTracking(true);
    setLastAnalysisTime(new Date());
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  useEffect(() => {
    if (isTracking && lastAnalysisTime) {
      const currentTime = new Date();
      if (currentTime - lastAnalysisTime >= 5 * 60 * 1000) {
        stopTracking();
      }
    }
  }, [isTracking, lastAnalysisTime]);

  if (!appointment) {
    return null; // Don't render anything if there's no appointment
  }

  return (
    <>
      <ChatButton href={getWhatsAppLink(appointment.phone, defaultMessage)} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon />
      </ChatButton>
      <AppointmentWhatsAppButton onClick={sendAppointmentMessage}>
        <WhatsAppIcon style={{ marginRight: '5px' }} />
        Send Appointment Details
      </AppointmentWhatsAppButton>
    </>
  );
}

export default Chat;