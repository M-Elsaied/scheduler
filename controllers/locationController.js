const Location = require('../models/Location');

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    let newLocation = new Location(req.body);
    let savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    let locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a location by ID
exports.updateLocation = async (req, res) => {
  try {
    let location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a location by ID
exports.deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndRemove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
