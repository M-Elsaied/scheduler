const Joi = require('joi');
const { objectId } = require('./custom.validation');

// name, address, phone

const createProvider = {
  body: Joi.object().keys({
    address: Joi.string().required(),
    phone: Joi.number().required(),
    name: Joi.string().required(),
  }),
};

const getProviders = {
  query: Joi.object().keys({
    rating: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProvider = {
  params: Joi.object().keys({
    providerId: Joi.string().custom(objectId),
  }),
};

const updateProvider = {
  params: Joi.object().keys({
    providerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
        address: Joi.string().required(),
        phone: Joi.number().required(),
        name: Joi.string().required(),
    })
    .min(1),
};

const deleteProvider = {
  params: Joi.object().keys({
    providerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    createProvider,
    getProviders,
    getProvider,
    updateProvider,
    deleteProvider,
};
