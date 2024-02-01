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
const queryLocations = async (filter, options) => {
    const deliveries = await Location.paginate(filter, options);
    return deliveries;
  };



module.exports = {
    createLocation,
    queryLocations
}

