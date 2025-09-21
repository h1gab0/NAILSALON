import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, parseISO } from 'date-fns';

const CouponContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.h3`
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
`;

const SubHeader = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CouponForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: end;
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
  height: fit-content;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const CouponList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CouponItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  gap: 1rem;
`;

const CouponInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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

const UpdateUsesContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    usesLeft: '',
    expiresAt: '',
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch('/api/coupons', { credentials: 'include' });
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
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.usesLeft || !newCoupon.expiresAt) {
      alert('Please fill in all fields for the new coupon.');
      return;
    }
    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCoupon),
        credentials: 'include',
      });
      if (response.ok) {
        const addedCoupon = await response.json();
        setCoupons([...coupons, addedCoupon]);
        setNewCoupon({ code: '', discount: '', usesLeft: '', expiresAt: '' });
      }
    } catch (error) {
      console.error('Error adding coupon:', error);
    }
  };

  const handleRemoveCoupon = async (code) => {
    try {
      const response = await fetch(`/api/coupons/${code}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setCoupons(coupons.filter((coupon) => coupon.code !== code));
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const handleUpdateCouponUses = async (code, newUses) => {
    try {
        const response = await fetch(`/api/coupons/${code}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usesLeft: newUses }),
            credentials: 'include',
        });
        if (response.ok) {
            const updatedCoupon = await response.json();
            setCoupons(coupons.map(c => c.code === code ? updatedCoupon : c));
        }
    } catch (error) {
        console.error('Error updating coupon uses:', error);
    }
  };

  const activeCoupons = coupons.filter(c => c.usesLeft > 0);
  const pastCoupons = coupons.filter(c => c.usesLeft <= 0);

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
        <Input
          type="number"
          placeholder="Number of Uses"
          value={newCoupon.usesLeft}
          onChange={(e) => setNewCoupon({ ...newCoupon, usesLeft: e.target.value })}
        />
        <Input
          type="date"
          value={newCoupon.expiresAt}
          onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
        />
        <Button type="submit">Add Coupon</Button>
      </CouponForm>

      <SectionHeader>Active Coupons</SectionHeader>
      <CouponList>
        {activeCoupons.map((coupon) => (
          <CouponItem key={coupon.code}>
            <CouponInfo>
                <strong>{coupon.code}</strong>
                <span>{coupon.discount}% off</span>
            </CouponInfo>
            <CouponInfo>
                <span>Uses Left: {coupon.usesLeft}</span>
                <span>Expires: {format(parseISO(coupon.expiresAt), 'MMMM d, yyyy')}</span>
            </CouponInfo>
            <UpdateUsesContainer>
                <Button onClick={() => handleUpdateCouponUses(coupon.code, coupon.usesLeft + 1)}>+</Button>
                <Button disabled={coupon.usesLeft <= 0} onClick={() => handleUpdateCouponUses(coupon.code, coupon.usesLeft - 1)}>-</Button>
            </UpdateUsesContainer>
            <RemoveButton onClick={() => handleRemoveCoupon(coupon.code)}>Remove</RemoveButton>
          </CouponItem>
        ))}
      </CouponList>

      <SectionHeader>Past Coupons</SectionHeader>
      <CouponList>
        {pastCoupons.map((coupon) => (
          <CouponItem key={coupon.code}>
            <CouponInfo>
                <strong>{coupon.code}</strong>
                <span>{coupon.discount}% off</span>
            </CouponInfo>
            <CouponInfo>
                <span>Uses Left: {coupon.usesLeft}</span>
                <span>Expires: {format(parseISO(coupon.expiresAt), 'MMMM d, yyyy')}</span>
            </CouponInfo>
            <UpdateUsesContainer>
                <Button onClick={() => handleUpdateCouponUses(coupon.code, coupon.usesLeft + 1)}>Re-enable (+)</Button>
            </UpdateUsesContainer>
            <RemoveButton onClick={() => handleRemoveCoupon(coupon.code)}>Remove</RemoveButton>
          </CouponItem>
        ))}
      </CouponList>
    </CouponContainer>
  );
};

export default CouponManagement;
