import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Container } from '@mui/material';
import styles from '../styles/dash.module.css';

function Dash() {
    const navigate = useNavigate();
    const user = window.localStorage.getItem('userRole');

    const Logout = () => {
        window.localStorage.removeItem('userEmail');
        window.localStorage.removeItem('userName');
        navigate('/', { replace: true });
    };

    return (
        <Container className={styles.container}>
            <Box className={styles.logoutBox}>
                <Button variant="contained" color="error" onClick={Logout}>
                    Logout
                </Button>
            </Box>
            <Box className={styles.mainContent}>
                <Box className={styles.linksBox}>
                    {user === 'user' ? (
                        <Button
                            variant="outlined"
                            size="large"
                            className={styles.button}
                            component={Link}
                            to="/available"
                        >
                            My Availability
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            size="large"
                            className={styles.button}
                            component={Link}
                            to="/employees"
                        >
                            Employees
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        size="large"
                        className={styles.button}
                        component={Link}
                        to="/meetings"
                    >
                        Upcoming Meetings
                    </Button>
                </Box>
                <Box className={styles.infoBox}>
                    <Typography variant="h5" component="p" fontFamily={'monospace'}>
                        Welcome to our intuitive scheduling application, where you can easily set your availability for any day or week. Admins can effortlessly view and manage this availability, scheduling one-on-one or group sessions with ease. Our user-friendly interface ensures a seamless experience for both setting and managing appointments.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default Dash;
