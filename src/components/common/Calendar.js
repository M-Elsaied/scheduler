import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

const Calendar = ({ user }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('/api/appointments', {
      headers: { 'Authorization': 'Bearer ' + user.token }
    })
      .then(res => {
        const appointmentsData = res.data.map(appointment => ({
          id: appointment._id,
          title: appointment.service,
          start: appointment.startTime,
          end: appointment.endTime,
          allDay: false
        }));
        setAppointments(appointmentsData);
      })
      .catch(err => console.error(err));
  }, [user.token]);

  const handleDateSelect = (selectInfo) => {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    if (title) {
      const appointment = {
        service: title,
        startTime: selectInfo.startStr,
        endTime: selectInfo.endStr,
        // INPUT_REQUIRED {Assuming user object contains userID and token}
        patient: user.userID,
        provider: user.userID
      };
      axios.post('/api/appointments', appointment, {
        headers: { 'Authorization': 'Bearer ' + user.token }
      })
        .then(res => {
          setAppointments([...appointments, {
            id: res.data._id,
            title: res.data.service,
            start: res.data.startTime,
            end: res.data.endTime,
            allDay: false
          }]);
          calendarApi.addEvent({
            id: res.data._id,
            title: res.data.service,
            start: res.data.startTime,
            end: res.data.endTime,
            allDay: false
          });
        })
        .catch(err => console.error(err));
    }
  };

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      axios.delete(`/api/appointments/${clickInfo.event.id}`, {
        headers: { 'Authorization': 'Bearer ' + user.token }
      })
        .then(() => {
          clickInfo.event.remove();
          setAppointments(appointments.filter(appointment => appointment.id !== clickInfo.event.id));
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      selectable={user.role === 'Doctor' || user.role === 'Admin'}
      selectMirror={true}
      dayMaxEvents={true}
      weekends={true}
      events={appointments}
      select={handleDateSelect}
      eventClick={handleEventClick}
    />
  );
};

export default Calendar;
