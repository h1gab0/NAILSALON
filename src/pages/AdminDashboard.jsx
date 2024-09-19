// src/pages/ADMINDASHBOARD.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import AdminCalendar from './AdminCalendar';
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
  margin-bottom: 1rem;
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

const AvailabilityContainer = styled.div`
  margin-top: 2rem;
`;

const TimeSlotContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TimeInput = styled.input`
  margin-right: 0.5rem;
`;

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState({});
  const [newTimeSlot, setNewTimeSlot] = useState('');
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
      appointment.id === id ? { ...appointment, notes: [note, ...(appointment.notes || [])] } : appointment
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
    const appointmentToCancel = appointments.find(appointment => appointment.id === id);
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Update availability
    const dateString = appointmentToCancel.date;
    const updatedAvailability = {
      ...availability,
      [dateString]: {
        ...availability[dateString],
        availableSlots: {
          ...availability[dateString]?.availableSlots,
          [appointmentToCancel.time]: true
        }
      }
    };
    setAvailability(updatedAvailability);
    localStorage.setItem('availability', JSON.stringify(updatedAvailability));
    window.dispatchEvent(new Event('storage'));
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

  const handleAddTimeSlot = () => {
    if (selectedDate && newTimeSlot) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const updatedAvailability = {
        ...availability,
        [dateString]: {
          ...availability[dateString],
          isAvailable: true,
          availableSlots: {
            ...availability[dateString]?.availableSlots,
            [newTimeSlot]: true
          }
        }
      };
      setAvailability(updatedAvailability);
      localStorage.setItem('availability', JSON.stringify(updatedAvailability));
      setNewTimeSlot('');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleRemoveTimeSlot = (time) => {
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const updatedAvailability = {
        ...availability,
        [dateString]: {
          ...availability[dateString],
          availableSlots: {
            ...availability[dateString]?.availableSlots,
            [time]: false
          }
        }
      };
      setAvailability(updatedAvailability);
      localStorage.setItem('availability', JSON.stringify(updatedAvailability));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleChangeTimeSlot = (oldTime, newTime) => {
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const updatedAvailability = {
        ...availability,
        [dateString]: {
          ...availability[dateString],
          availableSlots: {
            ...availability[dateString]?.availableSlots,
            [oldTime]: false,
            [newTime]: true
          }
        }
      };
      setAvailability(updatedAvailability);
      localStorage.setItem('availability', JSON.stringify(updatedAvailability));
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleDownloadImage = (imageData) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'inspiration_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>
      <Button onClick={handleLogout}>Logout</Button>
      <AdminCalendar appointments={appointments} onDaySelect={handleDaySelect} />
      {selectedDate && (
        <AvailabilityContainer>
          <h2>Availability for {format(selectedDate, 'MMMM d, yyyy')}</h2>
          <TimeSlotContainer>
            <TimeInput
              type="time"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
            />
            <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>
          </TimeSlotContainer>
          {availability[format(selectedDate, 'yyyy-MM-dd')]?.availableSlots && 
            Object.entries(availability[format(selectedDate, 'yyyy-MM-dd')].availableSlots)
              .filter(([_, isAvailable]) => isAvailable)
              .map(([time, _]) => (
                <TimeSlotContainer key={time}>
                  <TimeInput
                    type="time"
                    value={time}
                    onChange={(e) => handleChangeTimeSlot(time, e.target.value)}
                  />
                  <Button onClick={() => handleRemoveTimeSlot(time)}>Remove</Button>
                </TimeSlotContainer>
              ))
          }
        </AvailabilityContainer>
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
            {appointment.status === 'completed' && (
              <>
                <p>Profit: {appointment.profit}</p>
                <p>Materials: {appointment.materials}</p>
              </>
            )}
            {appointment.image && (
              <div>
                <p>Inspiration Image:</p>
                <img src={appointment.image} alt="Inspiration" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                <Button onClick={() => handleDownloadImage(appointment.image)}>Download Image</Button>
              </div>
            )}
            <NoteContainer>
              {appointment.notes && appointment.notes.map((note, index) => (
                <NoteItem key={index}>
                  <span>{note}</span>
                  <RemoveNoteButton onClick={() => handleRemoveNote(appointment.id, index)}>Remove</RemoveNoteButton>
                </NoteItem>
              ))}
            </NoteContainer>
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
          </AppointmentItem>
        ))}
      </AppointmentList>
    </DashboardContainer>
  );
}

export default AdminDashboard;