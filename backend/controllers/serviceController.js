const Service = require('../models/Service');

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { name, duration } = req.body;
    const service = new Service({ name, duration });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Get a specific service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json(service);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Update a service by ID
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, duration } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      id,
      { name, duration },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json(updatedService);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Delete a service by ID
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.json({ message: 'Service deleted.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
