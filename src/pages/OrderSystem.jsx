import React, { useState } from 'react';
import styled from 'styled-components';

const OrderContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
`;

const OrderForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
`;

const Select = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function OrderSystem() {
  const [order, setOrder] = useState({
    name: '',
    email: '',
    service: '',
    date: '',
    time: '',
  });

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this order to a backend
    console.log('Order submitted:', order);
    alert('Order submitted successfully!');
  };

  return (
    <OrderContainer>
      <h2>Place an Order</h2>
      <OrderForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={order.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={order.email}
          onChange={handleChange}
          required
        />
        <Select
          name="service"
          value={order.service}
          onChange={handleChange}
          required
        >
          <option value="">Select a Service</option>
          <option value="manicure">Manicure</option>
          <option value="pedicure">Pedicure</option>
          <option value="nail-art">Nail Art</option>
        </Select>
        <Input
          type="date"
          name="date"
          value={order.date}
          onChange={handleChange}
          required
        />
        <Input
          type="time"
          name="time"
          value={order.time}
          onChange={handleChange}
          required
        />
        <Button type="submit">Place Order</Button>
      </OrderForm>
    </OrderContainer>
  );
}

export default OrderSystem;