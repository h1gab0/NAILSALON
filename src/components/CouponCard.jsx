import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CouponWrapper = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.tertiary};
  text-align: center;
`;

const CouponTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const CouponDetails = styled.p`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const CouponCode = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  background-color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  display: inline-block;
  margin: 1rem 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CouponCard = ({ coupon }) => {
  if (!coupon) {
    return null;
  }

  return (
    <CouponWrapper
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CouponTitle>Your Exclusive Offer!</CouponTitle>
      <CouponDetails>
        Here's a <strong>{coupon.discount}%</strong> discount for your next visit!
      </CouponDetails>
      <CouponDetails>Use this code at checkout:</CouponDetails>
      <CouponCode>{coupon.code}</CouponCode>
      <CouponDetails>
        Expires on: {new Date(coupon.expiresAt).toLocaleDateString()}
      </CouponDetails>
    </CouponWrapper>
  );
};

export default CouponCard;
