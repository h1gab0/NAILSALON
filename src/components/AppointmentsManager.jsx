import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useInstance } from '../context/InstanceContext';
import AdminCalendar from '../pages/AdminCalendar';
import DayAvailabilityControl from '../pages/DayAvailabilityControl';
import CollapsibleAppointment from '../pages/CollapsibleAppointment';
import MarkAsCompleteModal from './MarkAsCompleteModal';
import { format } from 'date-fns';

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

const AppointmentsManager = () => {
    const { instanceId } = useInstance();
    const [appointments, setAppointments] = useState([]);
    const [availability, setAvailability] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [completingAppointment, setCompletingAppointment] = useState(null);

    const fetchData = useCallback(async () => {
        if (!instanceId) return;
        try {
            const [apptRes, availRes] = await Promise.all([
                fetch(`/api/${instanceId}/appointments`, { credentials: 'include' }),
                fetch(`/api/${instanceId}/availability`, { credentials: 'include' }),
            ]);
            if (!apptRes.ok || !availRes.ok) throw new Error('Failed to fetch data');
            const apptData = await apptRes.json();
            const availData = await availRes.json();
            setAppointments(apptData);
            setAvailability(availData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [instanceId]);

    useEffect(() => {
        fetchData();
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

    const handleOpenCompleteModal = (appointment) => {
        setCompletingAppointment(appointment);
        setIsModalOpen(true);
    };

    const filteredAppointments = selectedDate
        ? appointments.filter(a => a.startTime.startsWith(format(selectedDate, 'yyyy-MM-dd')))
        : appointments;

    return (
        <>
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
                                    onMarkAsComplete={handleOpenCompleteModal}
                                />
                            ))
                        ) : (
                            <p>No appointments for this day.</p>
                        )}
                    </Section>
                </Column>
            </MainLayout>
            {isModalOpen && (
                <MarkAsCompleteModal
                    appointment={completingAppointment}
                    onComplete={fetchData}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default AppointmentsManager;