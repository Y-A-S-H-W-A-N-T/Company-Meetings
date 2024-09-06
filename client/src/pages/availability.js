import React from 'react';
import styles from '../styles/available.module.css';
import { Link } from 'react-router-dom';
import { Box, Typography, Paper, useMediaQuery, useTheme } from '@mui/material';


function Availability() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayDate = currentDate.toLocaleDateString(undefined, options);


  return (
    <Box className={styles.container}>
        <Box className={styles.dateDisplay}>
            <Typography variant="h3">{todayDate}</Typography>
        </Box>
        <Box className={styles.featureDescription}>
            <Typography variant="h6">
                Select a day to manage or view availability. Each card represents a day of the week. Click on a day to see more details and manage your schedule. These contains current as well as upcoming weekdays.
            </Typography>
        </Box>
        <Box className={styles.gridContainer}>
            {daysOfWeek.map((day, index) => (
                <Paper 
                    key={index} 
                    elevation={6} 
                    className={styles.card} 
                    component={Link} 
                    to={`/available/${day.toLowerCase()}`}
                >
                    <Typography variant={isMobile ? "h5" : "h4"}>{day}</Typography>
                </Paper>
            ))}
        </Box>
    </Box>
  );
}

export default Availability;
