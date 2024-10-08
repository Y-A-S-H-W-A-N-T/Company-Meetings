const express = require('express');
const router = express.Router();
const { Users } = require('../Schema/userSchema')



router.post('/register',async(req,res)=>{
    const { name, email } = req.body
    try{
        const newUser = new Users({
            name: name,
            email: email,
            availability: {},
            meetings: [],
            role: 'user'
        })
    
        await newUser.save()
        res.status(200).json({msg: "Success"})
    }catch(err){
        console.log(err)
    }

})

router.post('/login',async(req,res)=>{
    const { name, email } = req.body
    try{
        const user = await Users.findOne({name: name, email: email})
        if (user != null)
            res.json({status: 200,msg: "user found", role: user.role})
        else
            res.json({status: 404, msg: 'no user'})
    }catch(err){
        console.log(err)
    }

})

router.post('/add-slot',async(req,res)=>{
    const { name, email, start, end, day } = req.body
    try{
        const newSlot = { start, end }

        const user = await Users.updateOne(
            { name: name, email: email },
            { $push: { [`availability.${day}`]: newSlot } }
        );

        if (!user) {
            return json({ status: 404, msg: 'no user' });
        }

        const updatedUser = await Users.findOne({ name: name, email: email });
        const updatedSlots = updatedUser.availability[day];

        res.status(200).json({msg: 'success', slots: updatedSlots})
    }catch(err){
        console.log(err)
    }

})

router.post('/get-slots', async (req, res) => {
    const { name, email, day } = req.body;

    try {

        const user = await Users.findOne({ name: name, email: email });

        if (!user) {
            return res.json({ status: 404, msg: 'User not found' });
        }
        const slots = user.availability[day];

        console.log(slots)

        if (!slots) {
            return resjson({ status: 404, msg: 'No slots found for this day' });
        }

        res.status(200).json({ status: 200, slots: slots });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, msg: 'Server error' });
    }
})

router.post('/delete-slot', async (req, res) => {
    const { slotID, name, email, day } = req.body;

    try {
        const user = await Users.findOne({ name: name, email: email });

        if (!user) {
            return res.status(404).json({ status: 404, msg: 'User not found' });
        }

        const slotIndex = user.availability[day].findIndex(slot => slot._id.toString() === slotID);

        if (slotIndex === -1) {
            return res.json({ status: 404, msg: 'Slot not found' });
        }

        user.availability[day].splice(slotIndex, 1)
        await user.save();

        const updatedUser = await Users.findOne({ name: name, email: email });
        const updatedSlots = updatedUser.availability[day];

        res.json({ status: 200, slots: updatedSlots });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, msg: 'Server error' });
    }
})


router.post('/get-employees/:id', async (req, res) => {
    const employeeID = req.params.id
    try {

        const user = await Users.findOne({_id: employeeID});

        if (!user) {
            return res.json({ status: 404, msg: 'User not found' });
        }
        res.status(200).json({ status: 200, employee: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, msg: 'Server error' });
    }
})

router.post('/get-meetings', async (req, res) => {
    const { email, name } = req.body;

    try {
        const user = await Users.findOne({ email, name }, 'meetings')

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ meetings: user.meetings});
    } catch (error) {
        console.error(error);
        res.json({ status: 400,msg: 'Error fetching meetings' });
    }
});


module.exports = router;