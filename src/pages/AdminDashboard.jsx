import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import AdminCalendar from './AdminCalendar';
import { format, parseISO, isBefore, startOfDay, set } from 'date-fns';
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

const AMPMSwitch = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const AMPMLabel = styled.span`
  font-size: 0.9rem;
  margin: 0 0.5rem;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text};
`;

const Switch = styled.div`
  width: 40px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ isAM }) => isAM ? '2px' : '22px'};
    width: 16px;
    height: 16px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    transition: left 0.3s;
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

const TimeInputWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 120px;
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: transparent;
  }

  &:focus::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const NonClickableTimeDisplay = styled.div`
  width: 120px;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  text-align: center;
`;

const TimeInputPlaceholder = styled.label`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  color: ${({ theme }) => theme.colors.textLight};
  pointer-events: none;
  transition: all 0.3s ease;
  opacity: ${({ hasValue }) => (hasValue ? 0 : 1)};
  text-align: center;
`;

const TimeSlotContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  ${TimeInput} {
    margin-right: 0.5rem;
  }
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

const CreateAppointmentButton = styled(Button)`
  margin-bottom: 1rem;
`;

const ClockContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ClockInstruction = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ClockFace = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  position: relative;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClockNumber = styled.div`
  position: absolute;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  transform: ${({ rotation }) => `rotate(${rotation}deg) translate(0, -80px) rotate(-${rotation}deg)`};
`;

const ClockHand = styled.div`
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.2s;
`;

const HourHand = styled(ClockHand)`
  width: 4px;
  height: 60px;
  transform: ${({ angle }) => `translateX(-50%) rotate(${angle}deg)`};
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

const MinuteHand = styled(ClockHand)`
  width: 2px;
  height: 80px;
  transform: ${({ angle }) => `translateX(-50%) rotate(${angle}deg)`};
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

const TimeDisplay = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ClockButton = styled(Button)`
  margin: 0.5rem;
`;

const ClockMarker = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  transform: ${({ angle }) => `rotate(${angle}deg) translateY(-90px)`};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const ModalSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
`;

const ModalButton = styled(Button)`
  margin-right: 0.5rem;
`;

const TimeSelectionContainer = styled.div`
  margin-bottom: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const AppointmentListSection = styled.div`
  width: 100%;
`;

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState({});
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showClock, setShowClock] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const clockRef = useRef(null);
  const isMobile = window.innerWidth <= 768;
  const [clockPhase, setClockPhase] = useState('hour');
  const [isAM, setIsAM] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    clientName: '',
    phone: '',
    time: '',
  });
  const [timeSelectionType, setTimeSelectionType] = useState('existing');
  const [modalClockVisible, setModalClockVisible] = useState(false);
  const timeWidgetRef = useRef(null);
  const appointmentListRef = useRef(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch('/api/admin/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          navigate('/login');
          return;
        }

        const data = await response.json();
        if (!data) {
          navigate('/login');
          return;
        }

        const storedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
        setAppointments(storedAppointments);
        const storedAvailability = JSON.parse(localStorage.getItem('availability')) || {};
        setAvailability(storedAvailability);
      } catch (error) {
        navigate('/login');
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleAddNote = (id, note) => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === id ? { ...appointment, notes: [note, ...(appointment.notes || [])] } : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const toggleAMPM = () => {
    setIsAM(!isAM);
    setSelectedTime(prevTime => {
      const hours = prevTime.getHours();
      const newHours = (hours + 12) % 24;
      return set(prevTime, { hours: newHours });
    });
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

  const handleEditNote = (appointmentId, noteIndex, newNoteText) => {
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        const updatedNotes = [...appointment.notes];
        updatedNotes[noteIndex] = newNoteText;
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
    
    setTimeout(() => {
      if (appointmentListRef.current) {
        const element = appointmentListRef.current;
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const scrollPosition = absoluteElementTop + elementRect.height - window.innerHeight;
        
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
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
          }
        }
      };
      
      // Check if the time slot already exists
      if (updatedAvailability[dateString].availableSlots[newTimeSlot]) {
        alert('This time slot already exists.');
        return;
      }
      
      // Add the new time slot
      updatedAvailability[dateString].availableSlots[newTimeSlot] = true;
      
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

  const handleUpdateAppointmentName = (id, newName) => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === id ? { ...appointment, clientName: newName } : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  const handleCreateAppointment = () => {
    if (selectedDate) {
      setShowModal(true);
    } else {
      alert('Please select a date first');
    }
  };

  const handleModalSubmit = () => {
    if (!newAppointment.clientName || !newAppointment.phone || 
        (timeSelectionType === 'existing' && !newAppointment.time) ||
        (timeSelectionType === 'new' && !newTimeSlot)) {
      alert('Please fill in all fields');
      return;
    }

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const appointmentTime = timeSelectionType === 'existing' ? 
      newAppointment.time : newTimeSlot;

    const newAppointmentObj = {
      id: Date.now(),
      date: dateString,
      time: appointmentTime,
      clientName: newAppointment.clientName,
      phone: newAppointment.phone,
      status: 'scheduled',
      notes: []
    };

    const updatedAppointments = [...appointments, newAppointmentObj];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));

    // Only update availability if using an existing time slot
    if (timeSelectionType === 'existing') {
      const updatedAvailability = {
        ...availability,
        [dateString]: {
          ...availability[dateString],
          availableSlots: {
            ...availability[dateString]?.availableSlots,
            [appointmentTime]: false
          }
        }
      };
      setAvailability(updatedAvailability);
      localStorage.setItem('availability', JSON.stringify(updatedAvailability));
    }

    setShowModal(false);
    setNewAppointment({ clientName: '', phone: '', time: '' });
    setNewTimeSlot('');
    setModalClockVisible(false);
    setTimeSelectionType('existing');
    window.dispatchEvent(new Event('storage'));
  };

  const handleTimeInputClick = () => {
    if (!isMobile) {
      setShowClock(true);
      // Wait for the clock widget to render
      setTimeout(() => {
        if (timeWidgetRef.current) {
          const element = timeWidgetRef.current;
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
          
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  const handleClockClick = (event) => {
    if (!clockRef.current) return;
  
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = centerY - event.clientY;
  
    // Calculate angle from 12 o'clock position
    let angle = Math.atan2(x, y) * (180 / Math.PI);
    angle = (angle + 360) % 360; // Normalize to 0-360
  
    if (clockPhase === 'hour') {
      let hours = Math.round(angle / 30) % 12;
      hours = hours === 0 ? 12 : hours;
      setSelectedTime(prevTime => set(prevTime, { hours }));
    } else {
      // Convert angle to minutes with a 5-minute snap
      let minutes = Math.round(angle / 6);
      minutes = Math.round(minutes / 5) * 5; // Snap to nearest 5 minutes
      minutes = minutes === 60 ? 0 : minutes; // Handle edge case for 60 minutes
      setSelectedTime(prevTime => {
        const newDate = set(prevTime, { minutes });
        return set(newDate, { hours: prevTime.getHours() });
      });
    }
  };

  const handleClockConfirm = () => {
    if (clockPhase === 'hour') {
      setClockPhase('minute');
    } else {
      let hours = selectedTime.getHours();
      if (!isAM && hours < 12) {
        hours += 12;
      } else if (isAM && hours === 12) {
        hours = 0;
      }
      const finalTime = set(selectedTime, { hours });
      setNewTimeSlot(format(finalTime, 'HH:mm'));
      setShowClock(false);
      setClockPhase('hour');
    }
  };

  const handleClockCancel = () => {
    setShowClock(false);
    setNewTimeSlot('');
    setClockPhase('hour'); // Reset to hour phase for next use
  };

  const removePastTimeSlotsAndEmptyDates = () => {
    const now = new Date();
    const updatedAvailability = { ...availability };
    let hasChanges = false;

    Object.keys(updatedAvailability).forEach(dateString => {
      const date = parseISO(dateString);
      const dateStart = startOfDay(date);
      
      if (isBefore(dateStart, startOfDay(now))) {
        delete updatedAvailability[dateString];
        hasChanges = true;
      } else {
        const availableSlots = updatedAvailability[dateString].availableSlots;
        Object.keys(availableSlots).forEach(timeSlot => {
          const slotTime = parseISO(`${dateString}T${timeSlot}`);
          if (isBefore(slotTime, now)) {
            delete availableSlots[timeSlot];
            hasChanges = true;
          }
        });
        
        // Remove the date if there are no available slots left
        if (Object.keys(availableSlots).length === 0) {
          delete updatedAvailability[dateString];
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setAvailability(updatedAvailability);
      localStorage.setItem('availability', JSON.stringify(updatedAvailability));
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Call removePastTimeSlotsAndEmptyDates when the component mounts and every minute
  useEffect(() => {
    removePastTimeSlotsAndEmptyDates();
    const interval = setInterval(removePastTimeSlotsAndEmptyDates, 60000);
    return () => clearInterval(interval);
  }, [availability]);

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

  const CustomTimeInput = ({ value, onChange, onClick, placeholder }) => {
    const [displayValue, setDisplayValue] = useState('');
  
    useEffect(() => {
      if (value) {
        setDisplayValue(value);
      } else {
        setDisplayValue('');
      }
    }, [value]);
  
    const handleInputChange = (e) => {
      let input = e.target.value.replace(/\D/g, '');
      
      if (input.length > 4) {
        input = input.slice(0, 4);
      }
  
      let formattedInput = '';
      if (input.length > 2) {
        formattedInput = `${input.slice(0, 2)}:${input.slice(2)}`;
      } else {
        formattedInput = input;
      }
  
      setDisplayValue(formattedInput);
  
      if (input.length === 4) {
        const hours = parseInt(input.slice(0, 2));
        const minutes = parseInt(input.slice(2));
        if (hours < 24 && minutes < 60) {
          onChange({ target: { value: formattedInput } });
        }
      } else {
        onChange({ target: { value: '' } });
      }
    };
  
    return (
      <TimeInputWrapper>
        <TimeInput
          type={isMobile ? "time" : "text"}
          value={displayValue}
          onChange={handleInputChange}
          onClick={onClick}
          placeholder={placeholder}
          maxLength={5}
        />
        <TimeInputPlaceholder hasValue={!!displayValue}>
          {placeholder}
        </TimeInputPlaceholder>
      </TimeInputWrapper>
    );
  };

  return (
    <DashboardContainer>
      <Header>Admin Dashboard</Header>
      <Button onClick={handleLogout}>Logout</Button>
      <AdminCalendar appointments={appointments} onDaySelect={handleDaySelect} />
      
      <AppointmentListSection ref={appointmentListRef}>
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
              onEditNote={handleEditNote}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onDownloadImage={handleDownloadImage}
              onUpdateName={handleUpdateAppointmentName}
            />
          ))}
        </AppointmentList>
      </AppointmentListSection>

      {selectedDate && (
        <AvailabilityContainer data-availability-section>
          <SubHeader>Availability for {format(selectedDate, 'MMMM d, yyyy')}</SubHeader>
          <CreateAppointmentButton onClick={handleCreateAppointment}>
            Create Appointment
          </CreateAppointmentButton>
          <TimeSlotContainer>
            <CustomTimeInput
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
              onClick={handleTimeInputClick}
              placeholder="Select time"
            />
            <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>
          </TimeSlotContainer>
          {showClock && !isMobile && (
            <ClockContainer ref={timeWidgetRef}>
              <ClockInstruction>
                {clockPhase === 'hour' ? 'Select hour' : 'Select minute'}
              </ClockInstruction>
              <TimeDisplay>{format(selectedTime, 'hh:mm')}</TimeDisplay>
              <AMPMSwitch>
                <AMPMLabel active={isAM}>AM</AMPMLabel>
                <Switch isAM={isAM} onClick={toggleAMPM} />
                <AMPMLabel active={!isAM}>PM</AMPMLabel>
              </AMPMSwitch>
              <ClockFace ref={clockRef} onClick={handleClockClick}>
                <HourHand
                  angle={selectedTime.getHours() * 30 + selectedTime.getMinutes() * 0.5}
                  show={clockPhase === 'hour'}
                />
                <MinuteHand
                  angle={selectedTime.getMinutes() * 6}
                  show={clockPhase === 'minute'}
                />
                {[...Array(12)].map((_, index) => (
                  <ClockNumber key={index} rotation={index * 30}>
                    {index === 0 ? 12 : index}
                  </ClockNumber>
                ))}
              </ClockFace>
              <div>
                <ClockButton onClick={handleClockConfirm}>
                  {clockPhase === 'hour' ? 'Next' : 'Confirm'}
                </ClockButton>
                <ClockButton onClick={handleClockCancel}>Cancel</ClockButton>
              </div>
            </ClockContainer>
          )}

          {availability[format(selectedDate, 'yyyy-MM-dd')]?.availableSlots &&
            Object.entries(availability[format(selectedDate, 'yyyy-MM-dd')].availableSlots)
              .filter(([_, isAvailable]) => isAvailable)
              .map(([time, _]) => (
                <TimeSlotContainer key={time}>
                  <NonClickableTimeDisplay>
                    {time}
                  </NonClickableTimeDisplay>
                  <Button onClick={() => handleRemoveTimeSlot(time)}>Remove</Button>
                </TimeSlotContainer>
              ))
          }
        </AvailabilityContainer>
      )}
      
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Create New Appointment</ModalTitle>
            <ModalInput
              type="text"
              placeholder="Client Name"
              value={newAppointment.clientName}
              onChange={(e) => setNewAppointment({ ...newAppointment, clientName: e.target.value })}
            />
            <ModalInput
              type="tel"
              placeholder="Phone Number"
              value={newAppointment.phone}
              onChange={(e) => setNewAppointment({ ...newAppointment, phone: e.target.value })}
            />
            
            <TimeSelectionContainer>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    value="existing"
                    checked={timeSelectionType === 'existing'}
                    onChange={(e) => {
                      setTimeSelectionType(e.target.value);
                      setModalClockVisible(false);
                    }}
                  />
                  Use Existing Time Slot
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    value="new"
                    checked={timeSelectionType === 'new'}
                    onChange={(e) => {
                      setTimeSelectionType(e.target.value);
                      setModalClockVisible(true);
                    }}
                  />
                  Create New Time Slot
                </RadioLabel>
              </RadioGroup>

              {timeSelectionType === 'existing' ? (
                <ModalSelect
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                >
                  <option value="">Select Time</option>
                  {availability[format(selectedDate, 'yyyy-MM-dd')]?.availableSlots &&
                    Object.entries(availability[format(selectedDate, 'yyyy-MM-dd')].availableSlots)
                      .filter(([_, isAvailable]) => isAvailable)
                      .map(([time, _]) => (
                        <option key={time} value={time}>{time}</option>
                      ))
                  }
                </ModalSelect>
              ) : (
                modalClockVisible && (
                  <ClockContainer>
                    <ClockInstruction>
                      {clockPhase === 'hour' ? 'Select hour' : 'Select minute'}
                    </ClockInstruction>
                    <TimeDisplay>{format(selectedTime, 'hh:mm')}</TimeDisplay>
                    <AMPMSwitch>
                      <AMPMLabel active={isAM}>AM</AMPMLabel>
                      <Switch isAM={isAM} onClick={toggleAMPM} />
                      <AMPMLabel active={!isAM}>PM</AMPMLabel>
                    </AMPMSwitch>
                    <ClockFace ref={clockRef} onClick={handleClockClick}>
                      <HourHand
                        angle={selectedTime.getHours() * 30 + selectedTime.getMinutes() * 0.5}
                        show={clockPhase === 'hour'}
                      />
                      <MinuteHand
                        angle={selectedTime.getMinutes() * 6}
                        show={clockPhase === 'minute'}
                      />
                      {[...Array(12)].map((_, index) => (
                        <ClockNumber key={index} rotation={index * 30}>
                          {index === 0 ? 12 : index}
                        </ClockNumber>
                      ))}
                    </ClockFace>
                    <div>
                      <ClockButton onClick={handleClockConfirm}>
                        {clockPhase === 'hour' ? 'Next' : 'Confirm'}
                      </ClockButton>
                      <ClockButton onClick={handleClockCancel}>Cancel</ClockButton>
                    </div>
                  </ClockContainer>
                )
              )}
            </TimeSelectionContainer>

            <ModalButton onClick={handleModalSubmit}>Create</ModalButton>
            <ModalButton onClick={() => {
              setShowModal(false);
              setModalClockVisible(false);
              setTimeSelectionType('existing');
            }}>Cancel</ModalButton>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
}

export default AdminDashboard;