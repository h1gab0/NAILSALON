import React from 'react';
import { Form, Input, Button } from './InventoryStyles';

function InventoryForm({ newItem, handleInputChange, handleSubmit }) {
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="text"
        name="name"
        value={newItem.name}
        onChange={handleInputChange}
        placeholder="Item Name"
        required
      />
      <Input
        type="number"
        name="quantity"
        value={newItem.quantity}
        onChange={handleInputChange}
        placeholder="Quantity"
        required
      />
      <Input
        type="number"
        name="price"
        value={newItem.price}
        onChange={handleInputChange}
        placeholder="Price"
        required
      />
      <Button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        Add Item
      </Button>
    </Form>
  );
}

export default InventoryForm;
