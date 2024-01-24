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
// Function to validate doctor's availability at a given time range
function validateDoctorAvailability(doctor, appointmentStartTime, appointmentEndTime) {
  // Assuming the doctor's availability is stored in the doctor.availability field
  const doctorAvailability = doctor.availability;

  // Extract the day of the week and time components from the appointment start and end times
  const appointmentDayOfWeek = new Date(appointmentStartTime).getDay();
  const appointmentStartHour = new Date(appointmentStartTime).getHours();
  const appointmentStartMinute = new Date(appointmentStartTime).getMinutes();
  const appointmentEndHour = new Date(appointmentEndTime).getHours();
  const appointmentEndMinute = new Date(appointmentEndTime).getMinutes();

  // Check if the appointment day of the week is valid according to the doctor's schedule
  if (!doctorAvailability.daysOfWeek.includes(appointmentDayOfWeek)) {
    return false; // Doctor is not available on this day of the week
  }

  // Convert doctor's working hours to comparable time components (e.g., "09:00 AM" to hours and minutes)
  const doctorWorkingHoursStart = parseTime(doctorAvailability.workingHours.start);
  const doctorWorkingHoursEnd = parseTime(doctorAvailability.workingHours.end);

  // Check if the appointment start time is within the doctor's working hours
  if (
    compareTime(appointmentStartHour, appointmentStartMinute, doctorWorkingHoursStart.hours, doctorWorkingHoursStart.minutes) < 0
  ) {
    return false; // Appointment starts before the doctor's working hours
  }

  // Check if the appointment end time is within the doctor's working hours
  if (
    compareTime(appointmentEndHour, appointmentEndMinute, doctorWorkingHoursEnd.hours, doctorWorkingHoursEnd.minutes) > 0
  ) {
    return false; // Appointment ends after the doctor's working hours
  }

  // If all checks pass, the doctor is available
  return true;
}

// Helper function to parse time in "hh:mm AM/PM" format
function parseTime(timeString) {
  const [time, ampm] = timeString.split(' ');
  const [hours, minutes] = time.split(':');
  return {
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    ampm
  };
}

// Helper function to compare two times
function compareTime(hour1, minute1, hour2, minute2) {
  if (hour1 < hour2) return -1;
  if (hour1 > hour2) return 1;
  if (minute1 < minute2) return -1;
  if (minute1 > minute2) return 1;
  return 0;
}
