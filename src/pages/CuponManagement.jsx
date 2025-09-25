import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CouponContainer = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CouponForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const CouponInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CouponButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CouponList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CouponListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const CouponManagement = ({ instanceId }) => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    fetch(`/api/${instanceId}/coupons`)
      .then(res => res.json())
      .then(data => setCoupons(data));
  }, [instanceId]);

  const handleAddCoupon = (e) => {
    e.preventDefault();
    const newCoupon = { code, discount: parseFloat(discount) };
    fetch(`/api/${instanceId}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCoupon),
    })
      .then(res => res.json())
      .then(addedCoupon => {
        setCoupons([...coupons, addedCoupon]);
        setCode('');
        setDiscount('');
      });
  };

  const handleDeleteCoupon = (id) => {
    fetch(`/api/${instanceId}/coupons/${id}`, { method: 'DELETE' })
      .then(() => {
        setCoupons(coupons.filter(coupon => coupon.id !== id));
      });
  };

  return (
    <CouponContainer>
      <h2>Coupon Management</h2>
      <CouponForm onSubmit={handleAddCoupon}>
        <CouponInput
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <CouponInput
          type="number"
          placeholder="Discount Percentage"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          required
        />
        <CouponButton type="submit">Add Coupon</CouponButton>
      </CouponForm>
      <CouponList>
        {coupons.map(coupon => (
          <CouponListItem key={coupon.id}>
            <span>{coupon.code} - {coupon.discount}% off</span>
            <button onClick={() => handleDeleteCoupon(coupon.id)}>Delete</button>
          </CouponListItem>
        ))}
      </CouponList>
    </CouponContainer>
  );
};

export default CouponManagement;
