const express = require('express');
const router = express.Router();
const { Users } = require('../Schema/userSchema')

router.post('/list-employees', async (req, res) => {
    try {
        const users = await Users.find({role: 'user'},'name email');

        if (!users) {
            return res.json({ status: 404, msg: 'User not found' });
        }
        res.status(200).json({ status: 200, employees: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, msg: 'Server error' });
    }
})

router.post('/schedule', async (req,res) => {
    const { day, startTime, endTime, employeeEmail, employeeName, employees } = req.body;

    try {
        // Find the user who is scheduling the meeting
        let scheduler = await Users.findOne({ email: employeeEmail, name: employeeName });
        if (!scheduler) {
            return res.status(404).json({ message: "Scheduler not found" });
        }

        // Prepare the attendees, including the scheduler
        const attendees = employees.map(employee => ({
            name: employee.name,
            email: employee.email
        }));

        // The meeting object to be inserted
        const meeting = {
            day,
            start: startTime,
            end: endTime,
            attendees
        };

        // Add the meeting to the scheduler's meetings
        scheduler.meetings.push(meeting);
        await scheduler.save();

        for (const attendee of attendees) {
            const attendeeUser = await Users.findOne({ email: attendee.email, name: attendee.name });

            if (attendeeUser) {
                attendeeUser.meetings.push(meeting);
                await attendeeUser.save();
            } else {
                console.log(`Attendee not found`);
            }
        }

        res.json({ msg: 'Schedduled Meeting', status: 200 })
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Error scheduling meeting' });
    }
});

router.post('/get-employees', async (req, res) => {
    try {

        const users = await Users.find({role: 'user'},'name email availability');

        if (!users) {
            return res.json({ status: 404, msg: 'User not found' });
        }
        res.status(200).json({ status: 200, employees: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, msg: 'Server error' });
    }
})

router.post('/remove-meeting', async(req,res)=>{
    const { start, end, attendees, day } = req.body
    try {
        const result = await Users.updateMany(
            { 'meetings.attendees.email': { $in: attendees.map(val => val.email) } },
            {
                $pull: {
                    meetings: {
                        day: day,
                        start: start,
                        end: end
                    }
                }
            }
        )

        console.log("removed meeting : ",result)

        res.status(200).json({ status: 200, message: 'Meeting removed successfully from all attendees.' });
    } catch (err) {
        console.error('Error removing meeting:', err);
        res.json({ status: 500, message: 'Failed to remove meeting' });
    }
})


module.exports = router;