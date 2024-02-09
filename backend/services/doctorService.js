// const Location = require('../models/Location');
const Doctor = require('../models/Doctor')
// const {Provider} = require('../models/Provider.js')
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');
const userService = require('../services/userService.js');

/**
 * Create a location
 * @param {Object} doctorBody
 * @returns {Promise<Doctor>}
 */
const createDoctor = async(doctorBody) => {
  // console.log(doctorBody, 'see doctor hody')
  expDoc = await userService.getOneUser(doctorBody.userId)
  console.log(expDoc)
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
  console.log('hit test doctor')
    return Doctor.findById(id);
  };


  const returnDocUser = async(id) => {
    console.log('see doc userUsers')
    return Doctor.findById(id).populate({
      path: 'userId',
      model: 'User'
    }).exec();
  }

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
    const doctor = await Doctor.findOneAndRemove({ _id: doctorId });
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
    }
    return await doctor.remove();
  };



module.exports = {
    createDoctor,
    queryDoctors,
    getDoctorById,
    updateDoctorById,
    deleteDoctorById,
    returnDocUser
}

