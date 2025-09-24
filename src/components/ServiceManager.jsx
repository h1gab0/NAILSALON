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
`;

const Input = styled.input`
  flex-grow: 1;
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

const ServiceManager = () => {
    const { instanceId } = useInstance();
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ name: '', price: '' });

    const fetchServices = async () => {
        if (!instanceId) return;
        try {
            const response = await fetch(`/api/${instanceId}/services`, { credentials: 'include' });
            if (response.ok) setServices(await response.json());
        } catch (error) {
            console.error("Failed to fetch services", error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [instanceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService(prev => ({ ...prev, [name]: value }));
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        if (!newService.name || !newService.price) return alert('Name and price are required.');

        try {
            const response = await fetch(`/api/${instanceId}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newService.name, price: parseFloat(newService.price) }),
                credentials: 'include'
            });
            if (response.ok) {
                fetchServices();
                setNewService({ name: '', price: '' });
            } else {
                alert('Failed to add service.');
            }
        } catch (error) {
            console.error("Failed to add service", error);
        }
    };

    const handleRemoveService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            const response = await fetch(`/api/${instanceId}/services/${serviceId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchServices();
            } else {
                alert('Failed to delete service.');
            }
        } catch (error) {
            console.error("Failed to delete service", error);
        }
    };

    return (
        <ManagerContainer>
            <SectionTitle>Manage Services</SectionTitle>
            <Form onSubmit={handleAddService}>
                <Input type="text" name="name" value={newService.name} onChange={handleInputChange} placeholder="Service Name" />
                <Input type="number" name="price" value={newService.price} onChange={handleInputChange} placeholder="Price" step="0.01" />
                <Button type="submit">Add Service</Button>
            </Form>
            <List>
                {services.map(service => (
                    <ListItem key={service.id}>
                        <span>{service.name} - ${service.price.toFixed(2)}</span>
                        <Button style={{backgroundColor: '#c0392b'}} onClick={() => handleRemoveService(service.id)}>Delete</Button>
                    </ListItem>
                ))}
            </List>
        </ManagerContainer>
    );
};

export default ServiceManager;