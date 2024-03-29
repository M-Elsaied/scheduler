const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// profileInfo{firstname, lastName, specialty, }

const doctorSchema = new Schema({
    // firstname: { type: String, required: true },
    // lastname: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    specialty: { type: String, required: true },
    ratings: {
      type: Number,
      default: 0
    },
    identification: {
      type: String,
      required: true
    },
    appointments: [{
      type: Schema.Types.ObjectId,
      ref: 'Appointment'  // Reference to services they can work
    }]

      // profileInfo: {
  //   firstName: { type: String, required: true },
  //   lastName: { type: String, required: true },
  //   specialty: { type: String, required: true },
  //   contactDetails: {
  //     phone: String,
  //     email: String
  //   }, 
  // serviceLocations: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'Location'
  // }],
  // availability: {
  //   daysOfWeek: [{
  //     type: String,  // You can use an array of strings to store the days of the week (e.g., ["Monday", "Wednesday"])
  //   }],
  //   workingHours: {
  //     start: String, // You can use a string to store the start time (e.g., "09:00 AM")
  //     end: String   // You can use a string to store the end time (e.g., "05:00 PM")
  //   },
    // services: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'Service'  // Reference to services they can work
    // }]
  // }
}, { timestamps: true });



const Doctor = mongoose.model('doctor', doctorSchema)

module.exports = Doctor;

// module.exports = mongoose.model('Doctor', doctorSchema);
