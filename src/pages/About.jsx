import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Paragraph = styled(motion.p)`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <AboutContainer>
      <Title variants={textVariants} initial="hidden" animate="visible">
        About Us
      </Title>
      <Paragraph variants={textVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        We are a team of passionate software developers dedicated to creating innovative solutions for businesses of all sizes. Our mission is to empower organizations with cutting-edge tools that streamline operations, boost productivity, and drive growth.
      </Paragraph>
      <Paragraph variants={textVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
        With years of experience in the industry, we have developed a deep understanding of the challenges faced by modern businesses. Our software tools are designed to address these challenges head-on, providing intuitive interfaces, powerful features, and seamless integration capabilities.
      </Paragraph>
      <Paragraph variants={textVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
        We believe in the power of technology to transform businesses and improve lives. That's why we're committed to continuous innovation and exceptional customer support. When you choose our software tools, you're not just getting a product – you're gaining a partner in your success.
      </Paragraph>
    </AboutContainer>
  );
}