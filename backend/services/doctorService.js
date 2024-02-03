// const Location = require('../models/Location');
const Doctor = require('../models/Doctor')
// const {Provider} = require('../models/Provider.js')
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

/**
 * Create a location
 * @param {Object} doctorBody
 * @returns {Promise<Doctor>}
 */
const createDoctor = async(doctorBody) => {
  console.log(doctorBody, 'see doctor hody')
    return Doctor.create(doctorBody)
}

/**
 * Query for doctors
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDoctors = async () => {
    const doctors = await Doctor.find();
    return doctors;
  };


  /**
 * Get doctor by id
 * @param {ObjectId} id
 * @returns {Promise<Provider>}
 */
const getDoctorById = async (id) => {
    return Doctor.findById(id);
  };

/**
 * Update provider by id
 * @param {ObjectId} doctorId
 * @param {Object} updateBody
 * @returns {Promise<Provider>}
 */
const updateDoctorById = async (doctorId, updateBody) => {
    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    Object.assign(doctor, updateBody);
    await doctor.save();
    return doctor;
  };

/**
 * Delete doctor by id
 * @param {ObjectId} doctorId
 * @returns {Promise<Provider>}
 */
const deleteDoctorById = async (doctorId) => {
    const provider = await Doctor.findOneAndRemove({ _id: providerId });
    if (!provider) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    return await provider.remove();
    // await subscription.remove();
    // return provider;
  };



module.exports = {
    createDoctor,
    queryDoctors,
    updateDoctorById,
    deleteDoctorById
}

