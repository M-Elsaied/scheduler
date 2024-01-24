
// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const location = new Location({ name, address, phone });
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Get a specific location by ID
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    res.json(location);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Update a location by ID
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { name, address, phone },
      { new: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    res.json(updatedLocation);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Delete a location by ID
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    res.json({ message: 'Location deleted.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
