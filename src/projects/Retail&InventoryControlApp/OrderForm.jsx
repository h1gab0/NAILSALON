import React from 'react';
import { Form, Input, Select, Button } from './RetailOrderStyles';

function OrderForm({ newOrder, inventory, handleInputChange, handleSubmit }) {
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        name="customer"
        value={newOrder.customer}
        onChange={handleInputChange}
        placeholder="Customer Name"
        required
      />
      <Select
        name="product"
        value={newOrder.product}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Product</option>
        {inventory.map(item => (
          <option key={item.id} value={item.name}>{item.name} (In stock: {item.quantity})</option>
        ))}
      </Select>
      <Input
        type="number"
        name="quantity"
        value={newOrder.quantity}
        onChange={handleInputChange}
        placeholder="Quantity"
        required
      />
      <Button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Place Order
      </Button>
    </Form>
  );
}

export default OrderForm;