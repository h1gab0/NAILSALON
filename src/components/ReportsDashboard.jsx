import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useInstance } from '../context/InstanceContext';

const ReportsContainer = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  text-align: center;
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 0.5rem 0;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.subtext};
  margin: 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 0.5rem;
`;

const InventoryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const InventoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-radius: 4px;
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const LOW_STOCK_THRESHOLD = 5;

const ReportsDashboard = () => {
    const { instanceId } = useInstance();
    const [appointments, setAppointments] = useState([]);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!instanceId) return;
            const [appointmentsRes, inventoryRes] = await Promise.all([
                fetch(`/api/${instanceId}/appointments`, { credentials: 'include' }),
                fetch(`/api/${instanceId}/inventory`, { credentials: 'include' })
            ]);
            if (appointmentsRes.ok) setAppointments(await appointmentsRes.json());
            if (inventoryRes.ok) setInventory(await inventoryRes.json());
        };
        fetchData();
    }, [instanceId]);

    const reportData = useMemo(() => {
        const completed = appointments.filter(a => a.status === 'completed');

        const totalRevenue = completed.reduce((sum, appt) => sum + (appt.finalPrice || 0), 0);
        const totalCost = completed.reduce((sum, appt) => sum + (appt.totalCost || 0), 0);
        const totalProfit = totalRevenue - totalCost;

        const lowStockItems = inventory.filter(item => item.quantity <= LOW_STOCK_THRESHOLD);

        return {
            totalRevenue,
            totalCost,
            totalProfit,
            lowStockItems,
            totalCompleted: completed.length
        };
    }, [appointments, inventory]);

    return (
        <ReportsContainer>
            <StatsGrid>
                <StatCard>
                    <StatValue>${reportData.totalRevenue.toFixed(2)}</StatValue>
                    <StatLabel>Total Revenue</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>${reportData.totalCost.toFixed(2)}</StatValue>
                    <StatLabel>Total Material Cost</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>${reportData.totalProfit.toFixed(2)}</StatValue>
                    <StatLabel>Total Profit</StatLabel>
                </StatCard>
                <StatCard>
                    <StatValue>{reportData.totalCompleted}</StatValue>
                    <StatLabel>Completed Appointments</StatLabel>
                </StatCard>
            </StatsGrid>

            <SectionTitle>Low Stock Items ( {LOW_STOCK_THRESHOLD} or fewer)</SectionTitle>
            <InventoryList>
                {reportData.lowStockItems.length > 0 ? (
                    reportData.lowStockItems.map(item => (
                        <InventoryItem key={item.id}>
                            <span>{item.name}</span>
                            <strong>{item.quantity} left</strong>
                        </InventoryItem>
                    ))
                ) : (
                    <p>No items are low on stock. Well done!</p>
                )}
            </InventoryList>
        </ReportsContainer>
    );
};

export default ReportsDashboard;