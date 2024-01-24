const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  profileInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    specialty: { type: String, required: true },
    contactDetails: {
      phone: String,
      email: String
    },
    ratings: {
      type: Number,
      default: 0
    }
  },
  identification: {
    type: String,
    required: true
  },
  serviceLocations: [{
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }],
  availability: {
    daysOfWeek: [{
      type: String,  // You can use an array of strings to store the days of the week (e.g., ["Monday", "Wednesday"])
    }],
    workingHours: {
      start: String, // You can use a string to store the start time (e.g., "09:00 AM")
      end: String   // You can use a string to store the end time (e.g., "05:00 PM")
    },
    services: [{
      type: Schema.Types.ObjectId,
      ref: 'Service'  // Reference to services they can work
    }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
