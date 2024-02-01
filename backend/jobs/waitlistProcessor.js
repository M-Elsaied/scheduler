const Waitlist = require('../models/Waitlist');
const Appointment = require('../models/Appointment');
const { processWaitlist } = require('../controllers/waitlistController');
const moment = require('moment');

async function processWaitlistEntries() {
  try {
    const providers = await Appointment.find().distinct('provider');
    for (const provider of providers) {
      const availableSlots = await Appointment.find({
        provider,
        startTime: { $gte: new Date() }
      }).sort('startTime');

      for (const slot of availableSlots) {
        const isSlotAvailable = !(await Appointment.exists({
          provider: slot.provider,
          startTime: slot.startTime,
          endTime: slot.endTime
        }));

        if (isSlotAvailable) {
          await processWaitlist(slot.provider, slot.startTime, slot.endTime, slot.location);
        }
      }
    }
  } catch (error) {
    console.error('Error processing waitlist entries:', error);
  }
}

module.exports = {
  processWaitlistEntries,
};
