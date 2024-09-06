const mongoose = require('mongoose')

const { Schema } = mongoose

const slots = new Schema({
    start: String,
    end: String
});

const available = new Schema({
    monday: [slots],
    tuesday: [slots],
    wednesday: [slots],
    thursday: [slots],
    friday: [slots],
    saturday: [slots],
    sunday: [slots],
});

const attendee = new Schema({
    name: String,
    email: String
});

const meeting = new Schema({
    day: String,
    start: String,
    end: String,
    attendees: [attendee]
});

const userSchema = new Schema({
    name: String,
    email: String,
    availability: available,
    meetings: [meeting],
    role: String,
});

const Users = mongoose.models['user'] || mongoose.model('user', userSchema)

module.exports = { Users }