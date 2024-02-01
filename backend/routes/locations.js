const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const locationValidation = require('../validation/location.validation')
const locationController = require('../controllers/locationController')
// const userValidation = require('../validation/user.validation');
// const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

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
