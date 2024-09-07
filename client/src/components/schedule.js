import React, { useEffect, useState } from 'react';
import styles from '../styles/schedule.module.css';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CustomAlert } from  'alerts-react'

const Schedule = ({ isOpen, onClose, employeeName, employeeEmail, startTime, endTime, day }) => {
    const userEmail = window.localStorage.getItem('userEmail');
    const userName = window.localStorage.getItem('userName');
    
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
        // if he is already selected then do not select this employee
        const isEmployeeSelected = selectedEmployees.some((e) => e.email === email);
        if (!isEmployeeSelected) {
            setSelectedEmployees((prev) => [...prev,{ name: name, email: email }]);
        }
    };

    const scheduleMeeting = async () => {
        try {
            await axios.post('/admin/schedule', {
                employees: selectedEmployees,
                day,
                startTime,
                endTime,
                employeeEmail,
                employeeName
            });
            CustomAlert({
                title: 'Meeting Scheduled',
                description: 'Meeting scheduled in your upcoming meetings',
                type: 'success',
                showCancelButton: false,
                onConfirm: ()=> {}
            })
        } catch (error) {
            console.error('Error scheduling meeting:', error);
        }
        onClose()
        toast(`Meeting scheduled from ${startTime} to ${endTime} with ${employeeName}`)
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
                    <button onClick={scheduleMeeting}>Schedule</button>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
