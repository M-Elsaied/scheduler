// const Location = require('../models/Location');
const {Provider} = require('../models/Provider.js')
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

/**
 * Create a location
 * @param {Object} providerBody
 * @returns {Promise<Provider>}
 */
const createProvider = async(providerBody) => {
    return Provider.create(providerBody)
}

/**
 * Query for providers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProviders = async () => {
    const providers = await Provider.find();
    return providers;
  };


  /**
 * Get provider by id
 * @param {ObjectId} id
 * @returns {Promise<Provider>}
 */
const getProviderById = async (id) => {
    return Provider.findById(id);
  };

/**
 * Update provider by id
 * @param {ObjectId} providerId
 * @param {Object} updateBody
 * @returns {Promise<Provider>}
 */
const updateProviderById = async (providerId, updateBody) => {
    const provider = await getProviderById(providerId);
    if (!provider) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    Object.assign(provider, updateBody);
    await provider.save();
    return provider;
  };

/**
 * Delete provider by id
 * @param {ObjectId} providerId
 * @returns {Promise<Provider>}
 */
const deleteProviderById = async (providerId) => {
    const provider = await Provider.findOneAndRemove({ _id: providerId });
    if (!provider) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
    }
    return await provider.remove();
    // await subscription.remove();
    // return provider;
  };



module.exports = {
    createProvider,
    queryProviders,
    updateProviderById,
    deleteProviderById
}

