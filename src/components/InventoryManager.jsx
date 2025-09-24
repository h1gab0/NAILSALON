import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInstance } from '../context/InstanceContext';

const ManagerContainer = styled.div`
  padding: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 150px;
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

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const InventoryManager = () => {
    const { instanceId } = useInstance();
    const [inventory, setInventory] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', cost: '', quantity: '' });

    const fetchInventory = async () => {
        if (!instanceId) return;
        try {
            const response = await fetch(`/api/${instanceId}/inventory`, { credentials: 'include' });
            if (response.ok) setInventory(await response.json());
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, [instanceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.cost || !newItem.quantity) return alert('All fields are required.');

        try {
            const response = await fetch(`/api/${instanceId}/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newItem.name,
                    cost: parseFloat(newItem.cost),
                    quantity: parseInt(newItem.quantity, 10)
                }),
                credentials: 'include'
            });
            if (response.ok) {
                fetchInventory();
                setNewItem({ name: '', cost: '', quantity: '' });
            } else {
                alert('Failed to add item.');
            }
        } catch (error) {
            console.error("Failed to add item", error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await fetch(`/api/${instanceId}/inventory/${itemId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchInventory();
            } else {
                alert('Failed to delete item.');
            }
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };

    return (
        <ManagerContainer>
            <SectionTitle>Manage Inventory</SectionTitle>
            <Form onSubmit={handleAddItem}>
                <Input type="text" name="name" value={newItem.name} onChange={handleInputChange} placeholder="Item Name" />
                <Input type="number" name="cost" value={newItem.cost} onChange={handleInputChange} placeholder="Cost per item" step="0.01" />
                <Input type="number" name="quantity" value={newItem.quantity} onChange={handleInputChange} placeholder="Quantity" step="1" />
                <Button type="submit">Add Item</Button>
            </Form>
            <List>
                {inventory.map(item => (
                    <ListItem key={item.id}>
                        <span>{item.name}</span>
                        <span>Cost: ${item.cost.toFixed(2)}</span>
                        <span>In Stock: {item.quantity}</span>
                        <Button style={{backgroundColor: '#c0392b'}} onClick={() => handleRemoveItem(item.id)}>Delete</Button>
                    </ListItem>
                ))}
            </List>
        </ManagerContainer>
    );
};

export default InventoryManager;