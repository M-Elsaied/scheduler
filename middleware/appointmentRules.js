const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.checkDoubleBooking = async (req, res, next) => {
  const { provider, startTime, endTime } = req.body;

  const overlappingAppointment = await Appointment.findOne({
    provider,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });

  if (overlappingAppointment) {
    return res.status(400).json({ msg: 'Provider already has an appointment scheduled for this time.' });
  }

  next();
};

exports.checkWorkingHours = async (req, res, next) => {
  const { provider, startTime, endTime } = req.body;
  const dayOfWeek = new Date(startTime).getDay();

  const openingHour = new Date(startTime);
  openingHour.setHours(9, 0, 0, 0); // set to 9:00 AM

  const closingHour = new Date(endTime);
  closingHour.setHours(17, 0, 0, 0); // set to 5:00 PM

  if (dayOfWeek === 0 || dayOfWeek === 6 || startTime < openingHour || endTime > closingHour) {
    return res.status(400).json({ msg: 'Appointment must be within working hours (9 AM to 5 PM, Monday through Friday).' });
  }

  next();
};
