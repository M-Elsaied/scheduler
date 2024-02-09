// const Location = require('../models/Location');
// const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment.js')
const User = require('../models/User.js');
// const 
// const {Provider} = require('../models/Provider.js')
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');
// const {sendEmail, sendWhatsAppMessage} = require('../utils/notifications.js');
// const { waitlistService, doctorService } = require('./index.js');

/**
 * Create an appointment
 * @param {Object} appointmentBody
 * @returns {Promise<Appointment>}
 */
const createAppointment = async(appointmentBody) => {
    return Appointment.create(appointmentBody)
}

/**
 * Query for appointments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAppointments = async () => {
    const appointments = await Appointment.find();
    return appointments;
  };


  /**
 * Get appointment by id
 * @param {ObjectId} id
 * @returns {Promise<Appointment>}
 */
const getAppointmentById = async (id) => {
    return Appointment.findById(id);
  };

/**
 * Update appointment by id
 * @param {ObjectId} appointmentId
 * @param {Object} updateBody
 * @returns {Promise<Appointment>}
 */
const updateAppointmentById = async (appointmentId, updateBody) => {
    const appointment = await getAppointmentById(appointmentId);
    if (!appointment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    Object.assign(appointment, updateBody);
    await appointment.save();
    return appointment;
  };

/**
 * Delete doctor by id
 * @param {ObjectId} appointmentId
 * @returns {Promise<Appointment>}
 */
const deleteAppointmentById = async (appointmentId) => {
    const appointment = await Appointment.findOneAndRemove({ _id: appointmentId });
    if (!appointment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    return await provider.remove();
    // await subscription.remove();
    // return provider;
  };



module.exports = {
    createAppointment,
    queryAppointments,
    updateAppointmentById,
    deleteAppointmentById
}

