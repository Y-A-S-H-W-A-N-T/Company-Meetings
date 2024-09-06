import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/employees.module.css'
import { Box, Typography, Card, CardContent, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Employees() {
    const theme = useTheme();
    const [employees, setEmployees] = useState([])

    const daysOfWeek = [
        { fullName: 'monday', shortName: 'Mon' },
        { fullName: 'tuesday', shortName: 'Tue' },
        { fullName: 'wednesday', shortName: 'Wed' },
        { fullName: 'thursday', shortName: 'Thu' },
        { fullName: 'friday', shortName: 'Fri' },
        { fullName: 'saturday', shortName: 'Sat' },
        { fullName: 'sunday', shortName: 'Sun' }
    ];

    const fetch_employees = async () => {
        await axios.post('/user/get-employees')
            .then((res) => {
                setEmployees(res.data.employees)
                console.log(res.data.employees)
            })
    }

    useEffect(() => {
        fetch_employees()
    }, [])
    const isAvailable = (availability, day) => {
        return availability[day]?.length > 0;
    }

    return (
        <Box className={styles.container}>
            <Typography variant="h4" align="center" className={styles.header} fontFamily={'monospace'} color='orchid'>
                EMPLOYEES
            </Typography>
            <Box className={styles.employeeList}>
                {employees && employees.map((employee, index) => (
                    <Card key={index} className={styles.employeeCard}>
                        <CardContent>
                            <Link to={`/employees/${btoa(employee._id)}`} className={styles.employeeLink}>
                                <Box className={styles.employeeInfo}>
                                    <Box>
                                        <Typography variant="h6" className={styles.employeeName}>
                                            {employee.name}
                                        </Typography>
                                        <Typography variant="body1" className={styles.employeeEmail}>
                                            {employee.email}
                                        </Typography>
                                    </Box>
                                    <Box className={styles.availabilityBoxes}>
                                        {daysOfWeek.map((day, dayIndex) => (
                                            <Chip
                                                key={dayIndex}
                                                label={day.shortName}
                                                className={styles.availabilityBox}
                                                style={{
                                                    backgroundColor: isAvailable(employee.availability, day.fullName) ? theme.palette.success.main : theme.palette.error.main,
                                                    color: theme.palette.common.white,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                                <Typography className={styles.arrow}>→</Typography>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    )   
}

export default Employees