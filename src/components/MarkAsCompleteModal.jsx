import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInstance } from '../context/InstanceContext';

const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1001;
`;
const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 2rem; border-radius: 8px; width: 90%; max-width: 600px;
  max-height: 90vh; overflow-y: auto;
`;
const Title = styled.h2`
  margin-top: 0; color: ${({ theme }) => theme.colors.primary};
`;
const SectionTitle = styled.h3`
  margin-top: 1.5rem; margin-bottom: 1rem; color: ${({ theme }) => theme.colors.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}; padding-bottom: 0.5rem;
`;
const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary}; color: white;
  border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer;
  margin-right: 1rem; margin-top: 1.5rem;
  &:disabled { background-color: #ccc; cursor: not-allowed; }
`;
const FormGroup = styled.div`
    margin-bottom: 1rem;
    label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    input, select, textarea { width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid ${({ theme }) => theme.colors.border}; }
`;
const InventoryList = styled.div` display: flex; flex-direction: column; gap: 1rem; `;
const InventoryItem = styled.div` display: flex; justify-content: space-between; align-items: center; `;
const QuantityInput = styled.input` width: 60px; padding: 0.5rem; text-align: center; `;

const MarkAsCompleteModal = ({ appointment, onComplete, onClose }) => {
    const { instanceId } = useInstance();
    const [services, setServices] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [finalPrice, setFinalPrice] = useState('');
    const [materialsUsed, setUsedMaterials] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!instanceId) return;
            const [servicesRes, inventoryRes] = await Promise.all([
                fetch(`/api/${instanceId}/services`, { credentials: 'include' }),
                fetch(`/api/${instanceId}/inventory`, { credentials: 'include' })
            ]);
            if (servicesRes.ok) setServices(await servicesRes.json());
            if (inventoryRes.ok) setInventory(await inventoryRes.json());
        };
        fetchData();
    }, [instanceId]);

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        setSelectedServiceId(serviceId);
        const service = services.find(s => s.id === serviceId);
        if (service) setFinalPrice(service.price.toFixed(2));
    };

    const handleMaterialQuantityChange = (itemId, quantity) => {
        const numQuantity = parseInt(quantity, 10);
        let updatedMaterials = materialsUsed.filter(m => m.itemId !== itemId);
        if (numQuantity > 0) {
            updatedMaterials.push({ itemId, quantity: numQuantity });
        }
        setUsedMaterials(updatedMaterials);
    };

    const handleSubmit = async () => {
        if (!selectedServiceId) return alert('Please select a service.');
        try {
            const response = await fetch(`/api/${instanceId}/appointments/${appointment.id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: selectedServiceId,
                    finalPrice: parseFloat(finalPrice),
                    materialsUsed,
                }),
                credentials: 'include',
            });
            if (response.ok) {
                onComplete();
                onClose();
            } else {
                const errorData = await response.json();
                alert(`Failed to complete appointment: ${errorData.message}`);
            }
        } catch (error) {
            alert('An error occurred.');
        }
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <Title>Complete Appointment</Title>
                <p><strong>Client:</strong> {appointment.clientName}</p>

                <SectionTitle>Service & Pricing</SectionTitle>
                <FormGroup>
                    <label htmlFor="service">Service Performed</label>
                    <select id="service" value={selectedServiceId} onChange={handleServiceChange}>
                        <option value="">-- Select a service --</option>
                        {services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}
                    </select>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="finalPrice">Final Price ($)</label>
                    <input id="finalPrice" type="number" value={finalPrice} onChange={e => setFinalPrice(e.target.value)} step="0.01" />
                </FormGroup>

                <SectionTitle>Materials Used</SectionTitle>
                <InventoryList>
                    {inventory.map(item => (
                        <InventoryItem key={item.id}>
                            <span>{item.name} (In Stock: {item.quantity})</span>
                            <QuantityInput type="number" min="0" max={item.quantity} placeholder="0"
                                onChange={(e) => handleMaterialQuantityChange(item.id, e.target.value)} />
                        </InventoryItem>
                    ))}
                </InventoryList>

                <div>
                    <Button onClick={handleSubmit} disabled={!selectedServiceId}>Confirm & Complete</Button>
                    <Button style={{ backgroundColor: '#aaa' }} onClick={onClose}>Cancel</Button>
                </div>
            </ModalContent>
        </ModalBackdrop>
    );
};

export default MarkAsCompleteModal;