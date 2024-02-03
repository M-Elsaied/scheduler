const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const locationValidation = require('../validation/location.validation')
const locationController = require('../controllers/locationController')


const router = express.Router();

router.route('/')
.post(validate(locationValidation.createLocation), locationController.createLocation)
.get(validate(locationValidation.getLocations), locationController.getLocations)

// router
//   .route('/')
//   .post(validate(locationValidation.createLocation), locationController.createLocation)
//   .get(
//     function (req, _, next) {
//       req.query.only = typeof req.query.only === 'string' ? req.query.only.split(',') : req.query.only;
//       next();
//     },
//     validate(locationValidation.getLocations));
  // .get(auth(), validate(locationValidation.getLocations), locationController.getLocations);

// router
//   .route('/:locationId')
//   .get(auth(), validate(locationValidation.getLocation), locationController.getLocation)
//   .patch(auth(), validate(locationValidation.updateLocation), locationController.updateLocation)
//   .delete(auth(), validate(locationValidation.deleteLocation), locationController.deleteLocation);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { check } = require('express-validator');
// const { checkRole } = require('../middleware/auth');
// const locationController = require('../controllers/locationController');
// const passport = require('passport');

// // Create a new location
// router.post(
//   '/',
//   passport.authenticate('jwt', { session: false }),
//   checkRole(['Super Admin', 'Admin']),
//   [
//     check('name', 'Location name is required').not().isEmpty(),
//     check('address', 'Location address is required').not().isEmpty(),
//     check('phone', 'Location phone number is required').not().isEmpty()
//   ],
//   locationController.createLocation
// );

// // Get all locations
// router.get('/', locationController.getLocations);

// // Update a location by ID
// router.put('/:id',
//   passport.authenticate('jwt', { session: false }),
//   checkRole(['Super Admin', 'Admin']),
//   locationController.updateLocation
// );

// // Delete a location by ID
// router.delete('/:id',
//   passport.authenticate('jwt', { session: false }),
//   checkRole(['Super Admin', 'Admin']),
//   locationController.deleteLocation
// );

// module.exports = router;
