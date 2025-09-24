import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import AppointmentsManager from '../components/AppointmentsManager';
import ServiceManager from '../components/ServiceManager';
import InventoryManager from '../components/InventoryManager';
import CouponManagement from '../components/CouponManagement';
import ReportsDashboard from '../components/ReportsDashboard';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button`
  padding: 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem;
  float: right;
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const { logout } = useContext(AuthContext);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <AppointmentsManager />;
      case 'services':
        return <ServiceManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'coupons':
        return <CouponManagement />;
      case 'reports':
        return <ReportsDashboard />;
      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <Header>Admin Dashboard</Header>
      <Button onClick={logout}>Logout</Button>
      <TabContainer>
        <Tab active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')}>Appointments</Tab>
        <Tab active={activeTab === 'services'} onClick={() => setActiveTab('services')}>Services</Tab>
        <Tab active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>Inventory</Tab>
        <Tab active={activeTab === 'coupons'} onClick={() => setActiveTab('coupons')}>Coupons</Tab>
        <Tab active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>Reports</Tab>
      </TabContainer>
      <div>
        {renderTabContent()}
      </div>
    </DashboardContainer>
  );
};

export default AdminDashboard;