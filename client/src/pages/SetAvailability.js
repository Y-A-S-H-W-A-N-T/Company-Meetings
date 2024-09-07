import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import styles from '../styles/setavailable.module.css'
import { CustomAlert } from  'alerts-react'

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function SetAvailability() {
  const userEmail = window.localStorage.getItem('userEmail');
  const userName = window.localStorage.getItem('userName');
  const { day } = useParams()

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null)
  const [timeSlots, setTimeSlots] = useState([])
  const [isEntireDay, setIsEntireDay] = useState(false)

  const [currentDate, setCurrentDate] = useState('');
  const [futureDate, setFutureDate] = useState('');

  const today = new Date();

  const dayIndex = daysOfWeek.findIndex(d => d.toLowerCase() === day.toLowerCase());

  useEffect(() => {
    if (dayIndex !== -1) {
      const todayIndex = today.getDay()

      if (todayIndex === dayIndex) {
        setCurrentDate(today.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
        setFutureDate('')
      } else {
        const daysUntilNextOccurrence = (dayIndex - todayIndex + 7) % 7;
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + daysUntilNextOccurrence);

        setFutureDate(nextDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
        setCurrentDate('')
      }
    }
  }, [dayIndex]);

  const fetch_slots = async () => {
    await axios
      .post('/user/get-slots', { day: day, name: userName, email: userEmail })
      .then((res) => {
        setTimeSlots(res.data.slots);
      });
  }
  const handleAddSlot = async () => {
    if (startTime && endTime && startTime.isBefore(endTime)) {
      await axios
        .post('/user/add-slot', {
          start: startTime.format('HH:mm'),
          end: endTime.format('HH:mm'),
          name: userName,
          email: userEmail,
          day: day,
        })
        .then((res) => {
          setTimeSlots(res.data.slots);
          setStartTime(null);
          setEndTime(null);
        });
    } else {
      CustomAlert({
          title: 'Invalid Time',
          description: 'This is a 24hr format clock, choose time accordingly.',
          type: 'warning',
          showCancelButton: false,
          onConfirm: ()=> {}
      })
    }
  };

  useEffect(() => {
    fetch_slots();
  }, []);

  const handleRemoveSlot = async (id) => {
    await axios
      .post('/user/delete-slot', { day: day, name: userName, email: userEmail, slotID: id })
      .then((res) => {
        setTimeSlots(res.data.slots);
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.dateHeader}>{currentDate || futureDate}</h1>
      {!isEntireDay && (
        <div className={styles.timePickerContainer}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className={styles.timePicker}>
              <label>
                <p>Start Time</p>
                <TimePicker
                  value={startTime}
                  onChange={setStartTime}
                  renderInput={(params) => <TextField {...params} />}
                  minutesStep={30}
                  ampm={false}
                />
              </label>
              <label>
                <p>End Time</p>
                <TimePicker
                  value={endTime}
                  onChange={setEndTime}
                  renderInput={(params) => <TextField {...params} />}
                  minutesStep={30}
                  ampm={false}
                />
              </label>
            </div>
          </LocalizationProvider>
          <Button variant="contained" onClick={handleAddSlot} className={styles.addButton}>
            Add Slot
          </Button>
        </div>
      )}

      <div className={styles.scrollableBox}>
        <h3>Time Slots</h3>
        <ul className={styles.timeSlotList}>
          {timeSlots &&
            timeSlots.map((slot, index) => (
              <li key={index} className={`${styles.timeSlot} ${slot.selected ? styles.selected : ''}`}>
                {slot.start} - {slot.end}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveSlot(slot._id)}
                  className={styles.removeButton}
                >
                  Remove
                </Button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default SetAvailability;