import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const AppointmentList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const AppointmentItem = styled.li`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 4px;
`;

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      // Fetch appointments from API or local storage
      const fetchedAppointments = [
        { id: 1, date: '2024-09-01', time: '10:00', clientName: 'John Doe' },
        { id: 2, date: '2024-09-02', time: '14:00', clientName: 'Jane Smith' },
      ];
      setAppointments(fetchedAppointments);
    }
  }, [user, navigate]);

  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>
      <h2>Upcoming Appointments</h2>
      <AppointmentList>
        {appointments.map((appointment) => (
          <AppointmentItem key={appointment.id}>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            <p>Client: {appointment.clientName}</p>
          </AppointmentItem>
        ))}
      </AppointmentList>
    </DashboardContainer>
  );
}

export default AdminDashboard;