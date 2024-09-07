const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const userRoutes = require('./API/userRoutes')
const adminRoutes = require('./API/adminRoutes')

const mongoose = require('mongoose')


app.use(bodyParser.json())
app.use(cors())

app.use("/user",userRoutes)
app.use("/admin",adminRoutes)


mongoose.connect(process.env.MONGOOSE_URL).then(()=>{
    console.log("Connected")
})

app.listen(8000,(err)=>{
    if(err) return err
    console.log("Server Running")
})