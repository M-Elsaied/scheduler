const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

// patient, id, provider, id, service, location, sheraton, appointmentTime time, status

const createWaitlist = {
  body: Joi.object().keys({
    patientId: Joi.string().custom(objectId).required(),
    // : Joi.string().custom(objectId).allow(null),
    provider: Joi.string().custom(objectId).required(),
    service: Joi.string().required(),
    location: Joi.string().required(),
    appointmentTime: Joi.date().required(),
    status: Joi.string().required()
    // name: Joi.string(),
    // stripeCus: {type: String},
    // email: Joi.string().required().email(),
    // password: Joi.string().required().custom(password),
    // phone: Joi.string(),
    // role: Joi.string().required().valid('patient', 'doctor', 'staff', 'admin', 'superAdmin'),
  }),
};

const getWaitlists = {
  query: Joi.object().keys({
    service: Joi.string(),
    status: Joi.string(),
    // : Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      phone: Joi.string(),
      role: Joi.string().required().valid('customer', 'driver', 'kitchenManager', 'resturantStaff', 'resturantAdmin'),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    createWaitlist,
    getWaitlists,
    getUser,
    updateUser,
    deleteUser,
};
