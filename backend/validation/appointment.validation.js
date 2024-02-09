const Joi = require('joi');
const { objectId } = require('./custom.validation');




const createAppointment = {
  body: Joi.object().keys({
    patientId: Joi.string().custom(objectId),
    doctorId: Joi.string().custom(objectId),
    service: Joi.string(),
    time: Joi.date(),
    // startTime: Joi.date(),
    // endTime: Joi.date(),
    location: Joi.string().valid('Sheraton', 'Tagamo3', 'shero2', 'Downtown Clinic'),
    status: Joi.string().valid('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'),
  }),
};

const getAppointments = {
  query: Joi.object().keys({
    patientId: Joi.string().custom(objectId),
    doctorId: Joi.string().custom(objectId),
    service: Joi.string(),
    // startTime: Joi.date(),
    time: Joi.date(),
    location: Joi.string(),
    status: Joi.string().valid('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAppointment = {
  params: Joi.object().keys({
    appointmentId: Joi.string().custom(objectId),
  }),
};

const updateAppointment = {
  params: Joi.object().keys({
    doctorId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
    patientId: Joi.string().custom(objectId),
    doctorId: Joi.string().custom(objectId),
    service: Joi.string(),
    time: Joi.date(),
    // startTime: Joi.date(),
    // endTime: Joi.date(),
    location: Joi.string(),
    status: Joi.string().valid('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'),
    })
    .min(1),
};

const deleteAppointment = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId),
  }),
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment
};
