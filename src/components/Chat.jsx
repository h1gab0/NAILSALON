import React from 'react';
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

function Chat() {
  const phoneNumber = '528128590824'; // Replace with your actual WhatsApp number
  const message = 'Hola, vengo por tu página web.'; // Replace with your pre-defined message

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <ChatButton href={whatsappLink} target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon />
    </ChatButton>
  );
}

export default Chat;