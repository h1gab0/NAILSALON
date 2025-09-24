import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { useInstance } from '../context/InstanceContext';
import AdminCalendar from './AdminCalendar';
import DayAvailabilityControl from './DayAvailabilityControl';
import CollapsibleAppointment from './CollapsibleAppointment';
import CouponManagement from '../components/CouponManagement';
import { format } from 'date-fns';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem;
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 1rem;
  border-radius: 8px;
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

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState('appointments');
  const { logout } = useContext(AuthContext);
  const { instanceId } = useInstance();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!instanceId) return;
    try {
      const [apptRes, availRes] = await Promise.all([
        fetch(`/api/${instanceId}/appointments`, { credentials: 'include' }),
        fetch(`/api/${instanceId}/availability`, { credentials: 'include' }),
      ]);

      if (apptRes.status === 401 || availRes.status === 401) {
        navigate(`/${instanceId}/login`);
        return;
      }
      if (!apptRes.ok || !availRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const apptData = await apptRes.json();
      const availData = await availRes.json();

      setAppointments(apptData);
      setAvailability(availData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [instanceId, navigate]);

  useEffect(() => {
    fetchData();

    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('Admin dashboard connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Admin received WebSocket message:', message);
      if (message.type === 'availability_updated' || message.type === 'appointments_updated') {
        fetchData();
      }
    };

    ws.onclose = () => {
      console.log('Admin dashboard disconnected from WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, [fetchData]);

  const handleAvailabilityChange = async (date, slots) => {
    const dateString = format(date, 'yyyy-MM-dd');
    try {
      const response = await fetch(`/api/${instanceId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateString, slots }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update availability');
      fetchData();
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleCancel = async (id) => {
      if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
      try {
          const response = await fetch(`/api/${instanceId}/appointments/${id}`, {
              method: 'DELETE',
              credentials: 'include'
          });
          if (!response.ok) throw new Error('Failed to cancel appointment');
          fetchData();
      } catch (error) {
          console.error("Error cancelling appointment:", error);
      }
  };

  const filteredAppointments = selectedDate
    ? appointments.filter(a => a.startTime.startsWith(format(selectedDate, 'yyyy-MM-dd')))
    : appointments;

  const renderAppointmentsView = () => (
    <MainLayout>
        <Column>
          <Section>
            <h2>Calendar</h2>
            <AdminCalendar
              appointments={appointments}
              onDaySelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </Section>
          <Section>
            <h2>Availability</h2>
            <DayAvailabilityControl
              selectedDate={selectedDate}
              availability={availability[format(selectedDate, 'yyyy-MM-dd')] || { slots: [] }}
              onAvailabilityChange={handleAvailabilityChange}
            />
          </Section>
        </Column>

        <Column>
          <Section>
            <h2>Appointments for {selectedDate ? format(selectedDate, 'PPP') : 'All'}</h2>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(app => (
                <CollapsibleAppointment
                    key={app.id}
                    appointment={app}
                    onCancel={handleCancel}
                />
              ))
            ) : (
              <p>No appointments for this day.</p>
            )}
          </Section>
        </Column>
    </MainLayout>
  );

  return (
    <DashboardContainer>
      <Header>Admin Dashboard</Header>
      <Button onClick={logout}>Logout</Button>

      <TabContainer>
        <Tab active={activeView === 'appointments'} onClick={() => setActiveView('appointments')}>
          Appointments & Availability
        </Tab>
        <Tab active={activeView === 'coupons'} onClick={() => setActiveView('coupons')}>
          Coupons
        </Tab>
      </TabContainer>

      {activeView === 'appointments' && renderAppointmentsView()}
      {activeView === 'coupons' && <CouponManagement />}

    </DashboardContainer>
  );
}

export default AdminDashboard;