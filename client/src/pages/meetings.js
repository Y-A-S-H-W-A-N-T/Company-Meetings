import React, { useEffect, useState } from 'react';
import axios from 'axios'
import styles from '../styles/meeting.module.css'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { Button } from '@mui/material';
import { CustomAlert } from  'alerts-react'
import CircularProgress from '@mui/material/CircularProgress'

function Meetings() {
    const [meetings, setMeetings] = useState([]);

    const userEmail = window.localStorage.getItem('userEmail');
    const userName = window.localStorage.getItem('userName');
    const userRole = window.localStorage.getItem('userRole');

    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const fetchMeetings = async () => {
            setLoading(true)
            try {
                const res = await axios.post('/user/get-meetings', {
                    email: userEmail,
                    name: userName
                })
                setMeetings(res.data.meetings)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching meetings:', error);
            }
        };

        fetchMeetings();
    }, [userEmail, userName]);

    const removeMeeting = async(start,end,day,attendees)=>{
        await axios.post('/admin/remove-meeting',{start: start,end: end, attendees: attendees, day:day})
        .then((res)=>{
            CustomAlert({
                title: 'Meeting Removed',
                type: 'success',
                showCancelButton: false,
                onConfirm: ()=> window.location.reload()
            })
        })
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Upcoming Meetings</h2>
            {loading && <CircularProgress/>}
            {meetings.length === 0 ? (
                <p className={styles.noMeetings}>No upcoming meetings</p>
            ) : (
                <ul className={styles.meetingList}>
                {meetings.map((meeting, index) => (
                    <li key={index} className={styles.meetingItem}>
                    <div className={styles.meetingDetails}>
                        {userRole==='admin' && <Button style={{backgroundColor: 'white', float: 'right', border: '2px red solid', color: 'red'}} onClick={()=>removeMeeting(meeting.start,meeting.end, meeting.day, meeting.attendees)}>Remove</Button>}
                        <strong>Day:</strong>{meeting.day.toUpperCase()}<br />
                        <strong>Duration:</strong> {meeting.start} - {meeting.end} <br />
                        <Accordion className={styles.accordion}>
                        <AccordionSummary expandIcon='&raquo;'>
                            <strong>Attendees</strong>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul className={styles.attendeeList}>
                            {meeting.attendees.map((att, idx) => (
                                <li key={idx}>{att.name}</li>
                            ))}
                            </ul>
                        </AccordionDetails>
                        </Accordion>
                    </div>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}

export default Meetings;