const express = require('express');
const waitlistRoutes = require('./routes/waitlistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

app.use(express.json());
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/appointments', appointmentRoutes);

module.exports = app;
