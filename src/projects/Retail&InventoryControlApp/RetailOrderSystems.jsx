import React, { useState, useEffect } from 'react';
import { OrderSystemContainer, Title } from './RetailOrderStyles';
import OrderForm from './OrderForm';
import OrderTable from './OrderTable';
import { loadState, saveState } from './sharedStateManager';

function RetailOrderSystem() {
  const [state, setState] = useState(() => {
    const loadedState = loadState();
    return {
      ...loadedState,
      newOrder: { customer: '', product: '', quantity: '' }
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
      newOrder: { ...prevState.newOrder, [e.target.name]: e.target.value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.newOrder.customer && state.newOrder.product && state.newOrder.quantity) {
      const selectedProduct = state.inventory.find(item => item.name === state.newOrder.product);
      if (selectedProduct && selectedProduct.quantity >= parseInt(state.newOrder.quantity)) {
        const order = {
          ...state.newOrder,
          id: Date.now(),
          price: selectedProduct.price * parseInt(state.newOrder.quantity),
          date: new Date().toLocaleDateString()
        };
        
        setState(prevState => ({
          ...prevState,
          orders: [...prevState.orders, order],
          inventory: prevState.inventory.map(item => 
            item.name === state.newOrder.product 
              ? { ...item, quantity: item.quantity - parseInt(state.newOrder.quantity) } 
              : item
          ),
          newOrder: { customer: '', product: '', quantity: '' }
        }));
      } else {
        alert('Not enough inventory!');
      }
    }
  };

  const handleDelete = (id) => {
    const orderToDelete = state.orders.find(order => order.id === id);
    if (orderToDelete) {
      setState(prevState => ({
        ...prevState,
        orders: prevState.orders.filter(order => order.id !== id),
        inventory: prevState.inventory.map(item =>
          item.name === orderToDelete.product
            ? { ...item, quantity: item.quantity + parseInt(orderToDelete.quantity) }
            : item
        )
      }));
    }
  };

  return (
    <OrderSystemContainer>
      <Title>Retail Order System</Title>
      <OrderForm
        newOrder={state.newOrder}
        inventory={state.inventory}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <OrderTable
        orders={state.orders}
        handleDelete={handleDelete}
      />
    </OrderSystemContainer>
  );
}

export default RetailOrderSystem;