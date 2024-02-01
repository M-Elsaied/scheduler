const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {type: String, required: true},
  address: {type: String},
  phone: {type: String}

  // name, address, phone
  // profileInfo: {
  //   firstName: { type: String, required: true },
  //   lastName: { type: String, required: true },
  //   specialty: { type: String, required: true },
  //   contactDetails: {
  //     phone: String,
  //     email: String
  //   },
  //   ratings: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  // identification: {
  //   type: String,
  //   required: true
  // },
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
  //   services: [{
  //     type: Schema.Types.ObjectId,
  //     ref: 'Service'  // Reference to services they can work
  //   }]
  // }
}, { timestamps: true });



const Location = mongoose.model('location', locationSchema)

module.exports = Location;

// module.exports = mongoose.model('Doctor', doctorSchema);



// // Create a new location
// exports.createLocation = async (req, res) => {
//   try {
//     const { name, address, phone } = req.body;
//     const location = new Location({ name, address, phone });
//     await location.save();
//     res.status(201).json(location);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// };

// // Get all locations
// exports.getLocations = async (req, res) => {
//   try {
//     const locations = await Location.find();
//     res.json(locations);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// };

// // Get a specific location by ID
// exports.getLocationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const location = await Location.findById(id);

//     if (!location) {
//       return res.status(404).json({ message: 'Location not found.' });
//     }

//     res.json(location);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// };

// // Update a location by ID
// exports.updateLocation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, address, phone } = req.body;
//     const updatedLocation = await Location.findByIdAndUpdate(
//       id,
//       { name, address, phone },
//       { new: true }
//     );

//     if (!updatedLocation) {
//       return res.status(404).json({ message: 'Location not found.' });
//     }

//     res.json(updatedLocation);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// };

// // Delete a location by ID
// exports.deleteLocation = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedLocation = await Location.findByIdAndDelete(id);

//     if (!deletedLocation) {
//       return res.status(404).json({ message: 'Location not found.' });
//     }

//     res.json({ message: 'Location deleted.' });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send('Server error');
//   }
// };
