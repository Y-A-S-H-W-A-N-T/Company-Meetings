import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import styles from '../styles/employee_availability.module.css';

function Employee_Availability() {
    const { id } = useParams();
    const employeeID = atob(id);

    const [employee, setEmployee] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const daysOfWeek = [
        { fullName: 'monday', shortName: 'Mon' },
        { fullName: 'tuesday', shortName: 'Tue' },
        { fullName: 'wednesday', shortName: 'Wed' },
        { fullName: 'thursday', shortName: 'Thu' },
        { fullName: 'friday', shortName: 'Fri' },
        { fullName: 'saturday', shortName: 'Sat' },
        { fullName: 'sunday', shortName: 'Sun' }
    ];

    async function fetchAvailability(){
        try {
            const response = await axios.post(`/user/get-employees/${employeeID}`);
            setEmployee(response.data.employee);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, [id]);

    const isAvailable = (availability, day) => {
        return availability?.[day]?.length > 0;
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setSelectedTimeSlot(null);
        setSelectedStartTime('');
        setSelectedEndTime('');
    };

    const handleTimeSlotSelect = (timeSlot) => {
        setSelectedTimeSlot(timeSlot);
        setSelectedStartTime('');
        setSelectedEndTime('');
    };

    const handleStartTimeChange = (e) => {
        setSelectedStartTime(e.target.value);
    };

    const handleEndTimeChange = (e) => {
        setSelectedEndTime(e.target.value);
    };

    const handleScheduleMeeting = () => {
        if (!selectedTimeSlot) {
            alert('Please select a time slot.');
            return;
        }
        if (!selectedStartTime || !selectedEndTime) {
            alert('Please select both start and end times.');
            return;
        }
        if (selectedStartTime < selectedTimeSlot.start || selectedEndTime > selectedTimeSlot.end) {
            alert(`Please select a time between ${selectedTimeSlot.start} and ${selectedTimeSlot.end}.`);
            return;
        }
        if (selectedEndTime <= selectedStartTime) {
            alert('End time must be after the start time.');
            return;
        }
        setIsModalOpen(true)
    };

    const handleModalClose = () => {
        setIsModalOpen(false)
    };

    return (
        <div className={styles.container}>
            <Typography variant="h4">Employee Availability</Typography>
            {employee && (
                <>
                    <Typography variant="h6">Name: {employee.name}</Typography>
                    <Typography variant="h6">Email: {employee.email}</Typography>

                    <div className={styles.availability}>
                        <Typography variant="subtitle1">Availability:</Typography>
                        <div className={styles.availabilityBoxes}>
                            {daysOfWeek.map((day, index) => (
                                isAvailable(employee.availability, day.fullName) && (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        color={selectedDay === day.fullName ? 'primary' : 'default'}
                                        onClick={() => handleDayClick(day.fullName)}
                                    >
                                        {day.shortName}
                                    </Button>
                                )
                            ))}
                        </div>
                    </div>

                    {selectedDay && (
                        <div className={styles.timeSlots}>
                            <Typography variant="subtitle1">Select a time slot for {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}:</Typography>
                            <div className={styles.timeSlotOptions}>
                                {employee.availability[selectedDay].map((slot, index) => (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        color={selectedTimeSlot === slot ? 'primary' : 'default'}
                                        onClick={() => handleTimeSlotSelect(slot)}
                                    >
                                        {slot.start} - {slot.end}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedTimeSlot && (
                        <div className={styles.timePicker}>
                            <Typography variant="subtitle1">Select start time for the selected slot:</Typography>
                            <TextField
                                type="time"
                                value={selectedStartTime}
                                onChange={handleStartTimeChange}
                                sx={{ marginRight: 2 }}
                            />
                            {selectedStartTime && (
                                <>
                                    <Typography variant="subtitle1">Select end time:</Typography>
                                    <TextField
                                        type="time"
                                        value={selectedEndTime}
                                        onChange={handleEndTimeChange}
                                    />
                                </>
                            )}
                            <Typography variant="subtitle1">Available between: {selectedTimeSlot.start} to {selectedTimeSlot.end}</Typography>
                        </div>
                    )}

                    {selectedDay && selectedTimeSlot && (
                        <div className={styles.scheduleButton}>
                            <Button variant="contained" color="primary" onClick={handleScheduleMeeting}>Schedule Meeting</Button>
                        </div>
                    )}
                    <Dialog open={isModalOpen} onClose={handleModalClose}>
                        <DialogTitle>Confirm Meeting</DialogTitle>
                        <DialogContent>
                            <Typography variant="h6">Employee: {employee.name}</Typography>
                            <Typography variant="subtitle1">Email: {employee.email}</Typography>
                            <Typography variant="subtitle1">Day: {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</Typography>
                            <Typography variant="subtitle1">Start Time: {selectedStartTime}</Typography>
                            <Typography variant="subtitle1">End Time: {selectedEndTime}</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleModalClose}>Close</Button>
                            <Button onClick={handleModalClose} color="primary">Confirm</Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </div>
    );
}

export default Employee_Availability;
