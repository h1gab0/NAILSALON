import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInstance } from '../context/InstanceContext';

const CouponContainer = styled.div`
  padding: 1rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
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
`;

const CouponList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CouponItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CouponManagement = () => {
    const { instanceId } = useInstance();
    const [coupons, setCoupons] = useState([]);
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiryDate: '' });

    const fetchCoupons = async () => {
        if (!instanceId) return;
        try {
            const response = await fetch(`/api/${instanceId}/coupons`, { credentials: 'include' });
            if (response.ok) {
                setCoupons(await response.json());
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [instanceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon(prev => ({ ...prev, [name]: value }));
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        if (!newCoupon.code || !newCoupon.discount) return alert('Code and discount are required.');

        try {
            const response = await fetch(`/api/${instanceId}/coupons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCoupon),
                credentials: 'include'
            });
            if (response.ok) {
                fetchCoupons();
                setNewCoupon({ code: '', discount: '', expiryDate: '' });
            } else {
                alert('Failed to add coupon.');
            }
        } catch (error) {
            console.error("Failed to add coupon", error);
        }
    };

    const handleRemoveCoupon = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;

        try {
            const response = await fetch(`/api/${instanceId}/coupons/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchCoupons();
            } else {
                alert('Failed to delete coupon.');
            }
        } catch (error) {
            console.error("Failed to delete coupon", error);
        }
    };

    return (
        <CouponContainer>
            <h3>Manage Coupons</h3>
            <Form onSubmit={handleAddCoupon}>
                <Input type="text" name="code" value={newCoupon.code} onChange={handleInputChange} placeholder="Coupon Code" />
                <Input type="text" name="discount" value={newCoupon.discount} onChange={handleInputChange} placeholder="Discount (e.g., 10% or $5)" />
                <Input type="date" name="expiryDate" value={newCoupon.expiryDate} onChange={handleInputChange} />
                <Button type="submit">Add Coupon</Button>
            </Form>
            <CouponList>
                {coupons.map(coupon => (
                    <CouponItem key={coupon.id}>
                        <span>{coupon.code} - {coupon.discount}{coupon.expiryDate ? ` (Expires: ${coupon.expiryDate})` : ''}</span>
                        <Button style={{backgroundColor: '#c0392b'}} onClick={() => handleRemoveCoupon(coupon.id)}>Delete</Button>
                    </CouponItem>
                ))}
            </CouponList>
        </CouponContainer>
    );
};

export default CouponManagement;
