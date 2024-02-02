const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const doctorValidation = require('../validation/doctor.validation')
const doctorController = require('../controllers/doctorController')
// const locationValidation = require('../validation/location.validation')
// const locationController = require('../controllers/locationController')


const router = express.Router();

router.route('/')
.post(validate(doctorValidation.createDoctor), doctorController.createDoctor)
.get(validate(doctorValidation.getDoctors), doctorController.getDoctors)

module.exports = router;