const Joi = require('joi');
const { objectId } = require('./custom.validation');


const createDoctor = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    specialty: Joi.string(),
    ratings: Joi.number(),
    identification: Joi.string().required(),
    appointments: Joi.array(),
    status: Joi.string()
  }),
};

const getDoctors = {
  query: Joi.object().keys({
    userId: Joi.string().custom(objectId),
    specialty: Joi.string(),
    ratings: Joi.number(),
    identification: Joi.string(),
    appointments: Joi.array(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
  }),
};

const updateDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
    specialty: Joi.string(),
    ratings: Joi.number(),
    identification: Joi.string().required(),
    appointments: Joi.array(),
    })
    .min(1),
};

const deleteDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctor,
    updateDoctor,
    deleteDoctor,
};
