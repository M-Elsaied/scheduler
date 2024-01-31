const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required']
  },
  service: {
    type: String,
    required: [true, 'Service is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  location: {
    type: String,
    enum: ['Sheraton', 'Tagamo3', 'shero2', 'Downtown Clinic'],
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

appointmentSchema.index({ provider: 1, startTime: 1, service: 'text', location: 1 }); // Optimize queries based on provider, start time, service, and location

module.exports = mongoose.model('Appointment', appointmentSchema);
