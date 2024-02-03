const express = require('express');
// const waitlistRoutes = require('./routes/waitlistRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const locations = require('./routes/locations')
// const services = require('./routes/services')
// const auth = require('./routes/authRoutes')
// const user = require('./routes/userRoute')
const session = require('express-session')
const passport = require('passport')
const jwtStrategy = require('./config/passport')
const routes = require('./routes')
const app = express();




app.use(express.json());
// app.use('/api/auth', auth)
// app.use('/api/waitlist', waitlistRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/locations', locations);
// app.use('/api/services', services);
// app.use('/api/user', user)
app.use(session({
    //js object with these properties
    secret:"local",
    resave:false,
    saveUninitialized:false
  }));
app.use(passport.initialize())
app.use(passport.session());
passport.use('local', jwtStrategy)

app.use('/v1', routes)
module.exports = app;
