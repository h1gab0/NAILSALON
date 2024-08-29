import React from 'react';
import { Table, Thead, Tbody, Tr, Th } from './RetailOrderStyles';
import OrderTableRow from './OrderTableRow';

function OrderTable({ orders, handleDelete }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Customer</Th>
          <Th>Product</Th>
          <Th>Quantity</Th>
          <Th>Total Price</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orders.map((order) => (
          <OrderTableRow key={order.id} order={order} handleDelete={handleDelete} />
        ))}
      </Tbody>
    </Table>
  );
}

export default OrderTable;