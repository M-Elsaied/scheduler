const express = require('express');
const waitlistRoutes = require('./routes/waitlistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const locations = require('./routes/locations')
const services = require('./routes/services')
const auth = require('./routes/authRoutes')
const app = express();

require('./models/Doctor');
require('./models/User');



app.use(express.json());
app.use('/api/auth', auth)
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/locations', locations);
app.use('/api/services', services);
module.exports = app;
