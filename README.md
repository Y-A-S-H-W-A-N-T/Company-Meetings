# Company-Meetings

A web-based application that allows users to dynamically set their availability for specific days or the entire week. The admin can view their availability and schedule sessions accordingly. Sessions can be one-on-one or involve multiple participants.

## YouTube Link

Link to Youtube where I have explained the project. It contains the walkthrough of the project
[YouTube Link](https://youtu.be/mIa7glIovfE)

## Features

**Impleted all mentioned requirments**

- **Employee can select and add/edit/remove their available time slots for the week**
- **Admin can schedule a meeting for a particular employee including attendess**
- **Users can check their upcoming scheduled meetings**
- **Admin can delete scheduled meeting**

## Technologies Used

- **Frontend:** React.js (with basic design)
- **Backend:** Node.js, Express.js (with microservice architecture)
- **Database:** MongoDB (for storing user information and session information)

## API Routes

- User API routes

### 1. `/login`
- **Method:** POST
- **Description:** authenticate user

### 2. `/register`
- **Method:** POST
- **Description:** register user to the website

### 3. `/get-session`
- **Method:** POST
- **Description:** fetch employee's availability of whole week

### 4. `/add-slot`
- **Method:** POST
- **Description:** add available time slot for particular day

### 5. `/delete-slots`
- **Method:** POST
- **Description:** delete employee's available time slots of a particular day

### 6. `/get-employees/:id`
- **Method:** POST
- **Description:** fetch a particular employee's availabilty,name and email using employee id

### 7. `/get-meetings`
- **Method:** POST
- **Description:** fetch all scheduled meetings

- Admin API routes

### 1. `/list-employees`
- **Method:** POST
- **Description:** Fetch all employees name for adding in a meeting

### 2. `/schedule`
- **Method:** POST
- **Description:** schedules a meeting for a particular day and time including attendees.

### 3. `/get-employees`
- **Method:** POST
- **Description:** fetches all employee's name, email and availability of whole week

### 4. `/remove-meeting`
- **Method:** POST
- **Description:** deletes a scheduled meeting

## Project

### Prerequisites

- Node.js and npm installed on your machine.
- A MongoDB database set up.

### Environmental Variables

- MONGOOSE_URL = mongodb-url

### Accessing the Application

- Clone this repository
- Set up the environmental variables
- Install all the dependencies using **npm install**
- Navigate to the client folder **cd client**
- Run the react file using **npm start**
- Navigate to the server folder **cd server**
- Run the express project using **nodemon server.js** or **node server.js**
- Open your browser and navigate to `http://localhost:3000` to access the application.

## Folder Structure

```plaintext
├── client      # Frontend React.js code
│    |──src 
|        |─components
|            |─login
|            |─register
|            |─schedule
|        |─pages
|            |─dash
|            |─employee_availability
|            |─availability
|            |─meeting
|            |─home
|            |─employee
|            |─SetAvailability
            
├── server                  # Backend Node.js/Express.js code
│   ├── API                 # API route handlers
|   |    |──adminRoutes
|   |    |──userRoutes
│   └── Schema
|        |──userSchema      # Mongoose models for MongoDB
└── README.md               # Project documentation
```
## Schema for User

**slots**
- start: String,
- end: String


**available**
- monday: [slots],
- tuesday: [slots],
- wednesday: [slots],
- thursday: [slots],
- friday: [slots],
- saturday: [slots],
- sunday: [slots],

**attendee**
- name: String,
- email: String

**meeting**
- day: String,
- start: String,
- end: String,
- attendees: [attendee]

**userSchema**
- name: String,
- email: String,
- availability: available,
- meetings: [meeting],
- role: String,

