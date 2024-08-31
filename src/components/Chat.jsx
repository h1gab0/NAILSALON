import React, { useState } from 'react';
import styled from 'styled-components';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: ${({ isOpen }) => (isOpen ? '400px' : '60px')};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: height 0.3s ease-in-out;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
`;

const ChatBody = styled.div`
  height: calc(100% - 120px);
  overflow-y: auto;
  padding: 10px;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 10px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary};
`;

const Message = styled.div`
  background-color: ${({ theme, isUser }) =>
    isUser ? theme.colors.primary : theme.colors.secondary};
  color: white;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
  max-width: 80%;
  align-self: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, isUser: true }]);
      setInput('');
      // Simulate a response from the salon
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Thank you for your message. We'll get back to you shortly.",
            isUser: false,
          },
        ]);
      }, 1000);
    }
  };

  return (
    <ChatContainer isOpen={isOpen}>
      <ChatHeader onClick={toggleChat}>
        <FaWhatsapp />
        Chat with us
        {isOpen && <FaTimes />}
      </ChatHeader>
      {isOpen && (
        <>
          <ChatBody>
            {messages.map((message, index) => (
              <Message key={index} isUser={message.isUser}>
                {message.text}
              </Message>
            ))}
          </ChatBody>
          <form onSubmit={handleSend}>
            <ChatInput
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
          </form>
        </>
      )}
    </ChatContainer>
  );
}

export default Chat;