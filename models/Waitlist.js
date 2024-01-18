const mongoose = require('mongoose');
const { Schema } = mongoose;

const waitlistSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient is required']
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required']
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

const Waitlist = mongoose.model('Waitlist', waitlistSchema);

module.exports = Waitlist;
