import React from 'react';
import styled from 'styled-components';
import { FaTicketAlt } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

const CouponWrapper = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  background: linear-gradient(145deg, ${({ theme }) => theme.colors.cardBackground}, #ffffff);
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: ${({ theme }) => theme.colors.text};
`;

const CouponTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const CouponCode = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  display: inline-block;
  margin: 0.5rem 0;
`;

const CouponDetails = styled.p`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const CouponCard = ({ coupon }) => {
  if (!coupon) {
    return null;
  }

  return (
    <CouponWrapper>
      <CouponTitle>
        <FaTicketAlt /> Your Exclusive Offer!
      </CouponTitle>
      <CouponDetails>{coupon.description}</CouponDetails>
      <CouponCode>{coupon.code}</CouponCode>
      <CouponDetails>
        Valid until: {format(parseISO(coupon.expiryDate), 'MMMM d, yyyy')}
      </CouponDetails>
    </CouponWrapper>
  );
};

export default CouponCard;
