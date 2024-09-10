// src/components/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import AdminCalendar from './AdminCalendar';
import DayAvailabilityControl from './DayAvailabilityControl';
import { format } from 'date-fns';

const DashboardContainer = styled.div`
  max-width: 1200px;
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

const AppointmentDetails = styled.div`
  margin-top: 1rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const NoteContainer = styled.div`
  margin-top: 0.5rem;
`;

const NoteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
`;

const RemoveNoteButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
`;

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState({});
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
      setAppointments(storedAppointments);
      const storedAvailability = JSON.parse(localStorage.getItem('availability')) || {};
      setAvailability(storedAvailability);
    }
  }, [user, navigate]);

  const handleAddNote = (id, note) => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === id ? { ...appointment, notes: [...(appointment.notes || []), note] } : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handleRemoveNote = (appointmentId, noteIndex) => {
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        const updatedNotes = appointment.notes.filter((_, index) => index !== noteIndex);
        return { ...appointment, notes: updatedNotes };
      }
      return appointment;
    });
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handleCancel = (id) => {
    console.log(`Cancelling appointment ${id} and sending WhatsApp message`);
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handleComplete = (id, profit, materials) => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: 'completed', profit, materials } : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDaySelect = (date) => {
    setSelectedDate(date);
  };

  const handleAvailabilityChange = (date, isAvailable, availableSlots) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const updatedAvailability = {
      ...availability,
      [dateString]: { isAvailable, availableSlots }
    };
    setAvailability(updatedAvailability);
    localStorage.setItem('availability', JSON.stringify(updatedAvailability));
  };

  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
      <AdminCalendar appointments={appointments} onDaySelect={handleDaySelect} />
      {selectedDate && (
        <DayAvailabilityControl
          selectedDate={selectedDate}
          onAvailabilityChange={handleAvailabilityChange}
        />
      )}
      <h2>Upcoming Appointments</h2>
      <AppointmentList>
        {appointments.map((appointment) => (
          <AppointmentItem key={appointment.id}>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
            <p>Client: {appointment.clientName}</p>
            <p>Phone: {appointment.phone}</p>
            <p>Status: {appointment.status}</p>
            <AppointmentDetails>
              <Button onClick={() => handleAddNote(appointment.id, prompt('Enter note:'))}>Add Note</Button>
              <Button onClick={() => handleCancel(appointment.id)}>Cancel</Button>
              {appointment.status !== 'completed' && (
                <Button onClick={() => {
                  const profit = prompt('Enter profit:');
                  const materials = prompt('Enter materials used:');
                  handleComplete(appointment.id, profit, materials);
                }}>Mark as Complete</Button>
              )}
            </AppointmentDetails>
            <NoteContainer>
              {appointment.notes && appointment.notes.map((note, index) => (
                <NoteItem key={index}>
                  <span>{note}</span>
                  <RemoveNoteButton onClick={() => handleRemoveNote(appointment.id, index)}>Remove</RemoveNoteButton>
                </NoteItem>
              ))}
            </NoteContainer>
            {appointment.status === 'completed' && (
              <>
                <p>Profit: {appointment.profit}</p>
                <p>Materials: {appointment.materials}</p>
              </>
            )}
          </AppointmentItem>
        ))}
      </AppointmentList>
    </DashboardContainer>
  );
}

export default AdminDashboard;