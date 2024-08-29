import React, { useState, useEffect } from 'react';
import { InventoryContainer, Title } from './InventoryStyles';
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';
import { loadState, saveState } from './sharedStateManager';

function InventoryControl() {
  const [state, setState] = useState(() => {
    const loadedState = loadState();
    return {
      ...loadedState,
      newItem: { name: '', quantity: '', price: '' }
    };
  });

  useEffect(() => {
    saveState({
      inventory: state.inventory,
      orders: state.orders
    });
  }, [state.inventory, state.orders]);

  const handleInputChange = (e) => {
    setState(prevState => ({
      ...prevState,
      newItem: { ...prevState.newItem, [e.target.name]: e.target.value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.newItem.name && state.newItem.quantity && state.newItem.price) {
      setState(prevState => ({
        ...prevState,
        inventory: [...prevState.inventory, { ...prevState.newItem, id: Date.now(), quantity: parseInt(prevState.newItem.quantity), price: parseFloat(prevState.newItem.price) }],
        newItem: { name: '', quantity: '', price: '' }
      }));
    }
  };

  const handleDelete = (id) => {
    setState(prevState => ({
      ...prevState,
      inventory: prevState.inventory.filter(item => item.id !== id)
    }));
  };

  return (
    <InventoryContainer>
      <Title>Inventory Control</Title>
      <InventoryForm
        newItem={state.newItem}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <InventoryTable
        inventory={state.inventory}
        handleDelete={handleDelete}
      />
    </InventoryContainer>
  );
}

export default InventoryControl;
