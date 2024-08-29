import React from 'react';
import { Tr, Td, Button } from './RetailOrderStyles';

function OrderTableRow({ order, handleDelete }) {
  return (
    <Tr>
      <Td data-label="Date">{order.date}</Td>
      <Td data-label="Customer">{order.customer}</Td>
      <Td data-label="Product">{order.product}</Td>
      <Td data-label="Quantity">{order.quantity}</Td>
      <Td data-label="Total Price">${parseFloat(order.price).toFixed(2)}</Td>
      <Td data-label="Actions">
        <Button onClick={() => handleDelete(order.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Delete
        </Button>
      </Td>
    </Tr>
  );
}

export default OrderTableRow;