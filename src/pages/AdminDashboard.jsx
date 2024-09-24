// src/pages/ADMINDASHBOARD.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import AdminCalendar from './AdminCalendar';
import { format } from 'date-fns';
import CollapsibleAppointment from './CollapsibleAppointment';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const AppointmentList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AppointmentItem = styled.li`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const AppointmentDetails = styled.div`
  padding: 1rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const NoteContainer = styled.div`
  margin-top: 1rem;
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
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
  }
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
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 768px) {
    justify-content: center;
  }
`;

const Tab = styled.button`
  background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.background};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: white;
  }
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const SubHeader = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState({});
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
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

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedDate) {
      return appointment.date === format(selectedDate, 'yyyy-MM-dd');
    }
    return true;
  }).sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
  });

  const displayedAppointments = filteredAppointments.filter(appointment => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UPCOMING') return appointment.status !== 'completed';
    if (activeTab === 'COMPLETED') return appointment.status === 'completed';
    return true;
  });

  const todayAppointments = appointments.filter(appointment => {
    const today = new Date();
    return appointment.date === format(today, 'yyyy-MM-dd') && appointment.status !== 'completed';
  }).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));

  return (
    <DashboardContainer>
      <Header>Admin Dashboard</Header>
      <Button onClick={handleLogout}>Logout</Button>
      <AdminCalendar appointments={appointments} onDaySelect={handleDaySelect} />
      
      <SubHeader>Today's Upcoming Appointments</SubHeader>
      <AppointmentList>
        {todayAppointments.map((appointment) => (
          <CollapsibleAppointment
            key={appointment.id}
            appointment={appointment}
            onAddNote={handleAddNote}
            onRemoveNote={handleRemoveNote}
            onCancel={handleCancel}
            onComplete={handleComplete}
            onDownloadImage={handleDownloadImage}
          />
        ))}
      </AppointmentList>

      {selectedDate && (
        <AvailabilityContainer>
          <SubHeader>Availability for {format(selectedDate, 'MMMM d, yyyy')}</SubHeader>
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
      
      <SubHeader>All Appointments</SubHeader>
      <TabContainer>
        <Tab active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')}>ALL</Tab>
        <Tab active={activeTab === 'UPCOMING'} onClick={() => setActiveTab('UPCOMING')}>UPCOMING</Tab>
        <Tab active={activeTab === 'COMPLETED'} onClick={() => setActiveTab('COMPLETED')}>COMPLETED</Tab>
      </TabContainer>
      <AppointmentList>
        {displayedAppointments.map((appointment) => (
          <CollapsibleAppointment
            key={appointment.id}
            appointment={appointment}
            onAddNote={handleAddNote}
            onRemoveNote={handleRemoveNote}
            onCancel={handleCancel}
            onComplete={handleComplete}
            onDownloadImage={handleDownloadImage}
          />
        ))}
      </AppointmentList>
    </DashboardContainer>
  );
}

export default AdminDashboard;