const mongoose = require('mongoose');
const { Schema } = mongoose;

const waitlistSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor is required']
  },
  service: {
    type: String,
    required: [true, 'Service is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: ['Sheraton', 'Sherouk', 'tagamo3'],
  },
  appointmentTime: {
    type: Date, // Assuming appointment time will be stored as a Date object
    required: [true, 'Appointment time is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

const Waitlist = mongoose.model('waitlist', waitlistSchema);

module.exports = Waitlist;
