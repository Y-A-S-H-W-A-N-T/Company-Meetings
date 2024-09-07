import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Button, TextField, Typography } from '@mui/material';
import styles from '../styles/employee_availability.module.css';
import Schedule from '../components/schedule';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


function Employee_Availability() {
    const { id } = useParams();
    const employeeID = atob(id);

    const [loading,setLoading] = useState(false)

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
        setLoading(true)
        try {
            const response = await axios.post(`/user/get-employees/${employeeID}`)
            setEmployee(response.data.employee);
            setLoading(false)
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

    const handleScheduleMeeting = () => {
        if (!selectedTimeSlot) {
            toast("Please select a time slot")
            return;
        }
        if (!selectedStartTime || !selectedEndTime) {
            toast("Please select both start and end times")
            return;
        }
        if (selectedStartTime.format('HH:mm') < selectedTimeSlot.start || selectedEndTime.format('HH:mm') > selectedTimeSlot.end) {
            toast(`Please select a time range between ${selectedTimeSlot.start} and ${selectedTimeSlot.end}`)
            return;
        }
        if (selectedEndTime <= selectedStartTime) {
            toast("End time must be after the start time")
            return;
        }
        setIsModalOpen(true)
    };

    const handleModalClose = () => {
        setIsModalOpen(false)
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <Typography variant="h4">Employee Availability</Typography>
            {loading && <CircularProgress/>}
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className={styles.timePicker}>
                                <Typography variant="subtitle1">Available between: {selectedTimeSlot.start} to {selectedTimeSlot.end}</Typography>
                                
                                <Typography variant="subtitle1">Select start time for the selected slot:</Typography>
                                <TimePicker
                                    value={dayjs(selectedStartTime)}
                                    onChange={(newValue) => setSelectedStartTime(newValue)}
                                    renderInput={(params) => <TextField {...params} sx={{ marginRight: 2 }} />}
                                    minutesStep={30}
                                    ampm={false}
                                />
                                
                                {selectedStartTime && (
                                    <>
                                        <Typography variant="subtitle1">Select end time:</Typography>
                                        <TimePicker
                                            value={dayjs(selectedEndTime)}
                                            onChange={(newValue) => setSelectedEndTime(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                            minutesStep={30}
                                            ampm={false}
                                        />
                                    </>
                                )}
                            </div>
                        </LocalizationProvider>
                    )}


                    {selectedDay && selectedTimeSlot && (
                        <div className={styles.scheduleButtonContainer}>
                            <button className={styles.scheduleButton} onClick={handleScheduleMeeting}>Schedule Meeting</button>
                        </div>
                    )}
                    {
                        isModalOpen &&
                        <div>
                            <Schedule
                                employeeEmail={employee.email}
                                employeeName={employee.name}
                                isOpen={isModalOpen}
                                onClose={handleModalClose}
                                day={selectedDay}
                                startTime={selectedStartTime}
                                endTime={selectedEndTime}
                            />
                        </div>
                    }
                </>
            )}
        </div>
    );
}

export default Employee_Availability;
