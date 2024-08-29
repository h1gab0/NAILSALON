import React from 'react';
import { Table, Thead, Tbody, Tr, Th } from './InventoryStyles';
import InventoryTableRow from './InventoryTableRow';

function InventoryTable({ inventory, handleDelete }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Quantity</Th>
          <Th>Price</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {inventory.map((item) => (
          <InventoryTableRow key={item.id} item={item} handleDelete={handleDelete} />
        ))}
      </Tbody>
    </Table>
  );
}

export default InventoryTable;