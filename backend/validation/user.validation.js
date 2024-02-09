const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    // : Joi.string().custom(objectId).allow(null),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    phone: Joi.string(),
    // name: Joi.string(),
    // stripeCus: {type: String},
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    phone: Joi.string(),
    role: Joi.string().required().valid('patient', 'doctor', 'staff', 'admin', 'superAdmin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    phone: Joi.string(),
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
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
