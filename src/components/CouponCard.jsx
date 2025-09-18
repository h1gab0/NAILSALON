import React from 'react';
import styled from 'styled-components';

const CouponWrapper = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px dashed #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  text-align: center;
`;

const CouponTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

const CouponCard = ({ coupon }) => {
  return (
    <CouponWrapper>
      <CouponTitle>Your Exclusive Offer!</CouponTitle>
      <p>Your coupon details will be shown here.</p>
    </CouponWrapper>
  );
};

export default CouponCard;
