const Joi = require('joi');
const { objectId } = require('./custom.validation');

// name, address, phone

const createLocation = {
  body: Joi.object().keys({
    address: Joi.string().required(),
    phone: Joi.number().required(),
    name: Joi.string().required(),
  }),
};

const getLocations = {
  query: Joi.object().keys({
    rating: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLocation = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().custom(objectId),
  }),
};

const updateLocation = {
  params: Joi.object().keys({
    subscriptionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        address: Joi.string().required(),
        phone: Joi.number().required(),
        name: Joi.string().required(),
    })
    .min(1),
};

const deleteLocation = {
  params: Joi.object().keys({
    subscriptionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    createLocation,
    getLocations,
    getLocation,
    updateLocation,
    deleteLocation,
};
