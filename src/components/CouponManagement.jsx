import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const CouponContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SubHeader = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CouponForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const CouponList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CouponItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '' });

  useEffect(() => {
    // Fetch coupons from the server
    const fetchCoupons = async () => {
      try {
        const response = await fetch('/api/coupons');
        if (response.ok) {
          const data = await response.json();
          setCoupons(data);
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) {
      alert('Please enter a coupon code and discount percentage.');
      return;
    }
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCoupon),
      });
      if (response.ok) {
        const addedCoupon = await response.json();
        setCoupons([...coupons, addedCoupon]);
        setNewCoupon({ code: '', discount: '' });
      }
    } catch (error) {
      console.error('Error adding coupon:', error);
    }
  };

  const handleRemoveCoupon = async (code) => {
    try {
      const response = await fetch(`/api/coupons/${code}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setCoupons(coupons.filter((coupon) => coupon.code !== code));
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <CouponContainer>
      <SubHeader>Coupon Management</SubHeader>
      <CouponForm onSubmit={handleAddCoupon}>
        <Input
          type="text"
          placeholder="Coupon Code"
          value={newCoupon.code}
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Discount (%)"
          value={newCoupon.discount}
          onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
        />
        <Button type="submit">Add Coupon</Button>
      </CouponForm>
      <CouponList>
        {coupons.map((coupon) => (
          <CouponItem key={coupon.code}>
            <span>{coupon.code} - {coupon.discount}% off</span>
            <RemoveButton onClick={() => handleRemoveCoupon(coupon.code)}>Remove</RemoveButton>
          </CouponItem>
        ))}
      </CouponList>
    </CouponContainer>
  );
};

export default CouponManagement;
