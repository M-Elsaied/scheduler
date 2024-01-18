const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendEmail, sendWhatsAppMessage } = require('../utils/notifications');
const waitlistController = require('./waitlistController');

exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    const patient = await User.findById(req.body.patient);
    const provider = await User.findById(req.body.provider);
    const message = `Dear ${patient.username}, your appointment with ${provider.username} at ${req.body.startTime} has been booked.`;

    sendEmail(patient.email, 'Appointment Booked', message);
    sendWhatsAppMessage(patient.phone, message);

    await waitlistController.processWaitlist(req.body.provider, req.body.startTime, req.body.endTime, req.body.location);

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findByIdAndUpdate(id, req.body, {new: true});
    const patient = await User.findById(req.body.patient);
    const provider = await User.findById(req.body.provider);
    const message = `Dear ${patient.username}, your appointment with ${provider.username} has been updated to start at ${req.body.startTime}.`;
    sendEmail(patient.email, 'Appointment Updated', message);
    sendWhatsAppMessage(patient.phone, message);
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id).populate('patient provider');
    await Appointment.findByIdAndDelete(id);
    const message = `Dear ${appointment.patient.username}, your appointment with ${appointment.provider.username} scheduled for ${appointment.startTime} has been cancelled.`;
    sendEmail(appointment.patient.email, 'Appointment Cancelled', message);
    sendWhatsAppMessage(appointment.patient.phone, message);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.searchAppointments = async (req, res) => {
  const { location, provider, service, startDate, endDate } = req.query;
  try {
    let query = {};
    if (location) {
      query.location = location;
    }
    if (provider) {
      query.provider = provider;
    }
    if (service) {
      query.service = new RegExp(service, 'i');
    }
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      query.startTime = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.startTime = { $lte: new Date(endDate) };
    }
    const appointments = await Appointment.find(query).populate('patient provider');
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
