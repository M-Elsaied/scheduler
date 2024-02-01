const Waitlist = require('../models/waitlist'); // Adjust the path as needed

exports.processWaitlist = async (provider, appointmentTime, location) => {
  try {
    const waitlistEntries = await Waitlist.find({
      provider,
      location,
      status: 'Pending',
      appointmentTime: { $lte: appointmentTime } // Process only if appointment time is less than or equal
    }).sort({ createdAt: 1 });

    // Process the waitlist entries
    for (const entry of waitlistEntries) {
      const { patient, service, location: entryLocation } = entry;

      // Check if the provider is available for the specified time slot
      const isProviderAvailable = await checkProviderAvailability(provider, appointmentTime, location);

      if (isProviderAvailable) {
        // Create an appointment for the patient
        await createAppointment(patient, provider, appointmentTime, service, entryLocation);

        // Update the status of the waitlist entry
        entry.status = 'Processed';
        await entry.save();

        // Notify the patient or perform any additional actions

        console.log(`Appointment created for patient ${patient} at ${appointmentTime}`);
      }
    }
  } catch (error) {
    console.error('Error processing waitlist:', error);
  }
};


exports.createWaitlistEntry = async (req, res) => {
  try {
    const newWaitlistEntry = new Waitlist({
      patient: req.body.patient,
      provider: req.body.provider,
      service: req.body.service,
      location: req.body.location,
      appointmentTime: req.body.appointmentTime // Include the appointment time

    });

    await newWaitlistEntry.save();

    res.status(201).json({
      message: 'Waitlist entry created successfully.',
      waitlistEntry: newWaitlistEntry
    });
  } catch (error) {
    console.error('Error creating waitlist entry:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getWaitlistEntries = async (req, res) => {
  try {
    const waitlistEntries = await Waitlist.find({}).sort({ createdAt: 1 });
    res.status(200).json(waitlistEntries);
  } catch (error) {
    console.error('Error retrieving waitlist entries:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWaitlistEntry = async (req, res) => {
  try {
    const waitlistEntryId = req.params.id;
    const waitlistEntry = await Waitlist.findById(waitlistEntryId);

    if (!waitlistEntry) {
      return res.status(404).json({ message: 'Waitlist entry not found.' });
    }

    if (waitlistEntry.status === 'Processed') {
      return res.status(400).json({ message: 'Cannot delete processed waitlist entries.' });
    }

    await waitlistEntry.remove();

    res.status(200).json({ message: 'Waitlist entry deleted successfully.' });
  } catch (error) {
    console.error('Error deleting waitlist entry:', error);
    res.status(500).json({ error: error.message });
  }
};


