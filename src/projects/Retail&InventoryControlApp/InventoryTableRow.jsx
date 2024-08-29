import React from 'react';
import { Tr, Td, Button } from './InventoryStyles';

function InventoryTableRow({ item, handleDelete }) {
  return (
    <Tr>
      <Td data-label="Name">{item.name}</Td>
      <Td data-label="Quantity">{item.quantity}</Td>
      <Td data-label="Price">${parseFloat(item.price).toFixed(2)}</Td>
      <Td data-label="Actions">
        <Button onClick={() => handleDelete(item.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Delete
        </Button>
      </Td>
    </Tr>
  );
}

export default InventoryTableRow;