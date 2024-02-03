const Location = require('../models/Location');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Create a location
 * @param {Object} locationBody
 * @returns {Promise<Location>}
 */
const createLocation = async(locationBody) => {
    return Location.create(locationBody)
}

/**
 * Query for deliveries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLocations = async () => {
    const deliveries = await Location.find();
    return deliveries;
  };


  /**
 * Get subscription by id
 * @param {ObjectId} id
 * @returns {Promise<Subscription>}
 */
const getLocationById = async (id) => {
    return Locattion.findById(id);
  };

/**
 * Update subscription by id
 * @param {ObjectId} locationId
 * @param {Object} updateBody
 * @returns {Promise<Location>}
 */
const updateLocationById = async (locationId, updateBody) => {
    const location = await getLocationById(locationId);
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    Object.assign(location, updateBody);
    await location.save();
    return location;
  };

/**
 * Delete subscription by id
 * @param {ObjectId} locationId
 * @returns {Promise<Location>}
 */
const deleteLocationById = async (locationId) => {
    const location = await Location.findOneAndRemove({ _id: locationId });
    if (!location) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    // await subscription.remove();
    return location;
  };



module.exports = {
    createLocation,
    queryLocations,
    updateLocationById,
    deleteLocationById
}

