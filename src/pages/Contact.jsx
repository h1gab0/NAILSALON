import React from 'react';
import styled from 'styled-components';
import ContactForm from '../components/ContactForm';

const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

export default function Contact() {
  return (
    <ContactContainer>
      <h1>Contact Us</h1>
      <ContactForm />
    </ContactContainer>
  );
}