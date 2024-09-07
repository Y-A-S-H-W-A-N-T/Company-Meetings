import React, { useEffect, useState } from 'react';
import styles from '../styles/schedule.module.css';
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CustomAlert } from  'alerts-react'

const Schedule = ({ isOpen, onClose, employeeName, employeeEmail, startTime, endTime, day }) => {
    const userEmail = window.localStorage.getItem('userEmail');
    const userName = window.localStorage.getItem('userName');

    const [loading,setLoading] = useState(false)
    
    const [employees, setEmployees] = useState([]);
    const [selectedEmployees, setSelectedEmployees] = useState([
        {
            name: employeeName,
            email: employeeEmail
        },
        {
            name: userName,
            email: userEmail
        }
    ]);

    const fetchAllEmployees = async () => {
        try {
            const res = await axios.post('/admin/list-employees');
            setEmployees(res.data.employees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchAllEmployees();
    }, []);

    if (!isOpen) return null;

    const handleAddEmployee = (name,email) => {
        const isEmployeeSelected = selectedEmployees.some((e) => e.email === email);
        if (!isEmployeeSelected) {
            setSelectedEmployees((prev) => [...prev,{ name: name, email: email }]);
        }
    };

    const scheduleMeeting = async () => {
        setLoading(true)
        try {
            await axios.post('/admin/schedule', {
                employees: selectedEmployees,
                day,
                startTime: startTime.format('HH:mm'),
                endTime: endTime.format('HH:mm'),
                employeeEmail,
                employeeName
            }).then(()=>{
                setLoading(false)
                toast(`Meeting scheduled from ${startTime.format('HH:mm')} to ${endTime.format('HH:mm')} with ${employeeName}`)
                CustomAlert({
                    title: 'Meeting Scheduled',
                    description: 'Meeting scheduled in your upcoming meetings',
                    type: 'success',
                    showCancelButton: false,
                    onConfirm: ()=> {}
                })
            })
        } catch (error) {
            console.error('Error scheduling meeting:', error);
        }
        onClose()
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 style={{fontFamily: 'monospace'}}>Schedule Meeting</h2>
                <p style={{fontFamily: 'monospace'}}>Select employees to add to the meeting:</p>
                <div className={styles.employeeList}>
                    {employees.map((employee, index) => (
                        <div key={index} className={styles.employeeItem}>
                            <span>{employee.name} ({employee.email})</span>
                            {!selectedEmployees.some(e => e.email === employee.email) && (
                                <button 
                                    onClick={() => handleAddEmployee(employee.name, employee.email)}
                                    className={styles.addButton}
                                >
                                    Add to Meeting
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div className={styles.modalButtons}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={scheduleMeeting} disabled={loading}>{!loading?'Schedule':'Scheduling...'}</button>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
