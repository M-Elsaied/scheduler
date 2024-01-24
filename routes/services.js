const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const passport = require('passport');
const { checkRole } = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

// Create a new service
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Super Admin', 'Admin']),
  [
    check('name', 'Service name is required').not().isEmpty(),
    check('duration', 'Service duration is required').not().isEmpty()
  ],
  serviceController.createService
);

// Get all services
router.get('/', serviceController.getServices);

// Get a specific service by ID
router.get('/:id', serviceController.getServiceById);

// Update a service by ID
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Super Admin', 'Admin']),
  [
    check('name', 'Service name is required').not().isEmpty(),
    check('duration', 'Service duration is required').not().isEmpty()
  ],
  serviceController.updateService
);

// Delete a service by ID
router.delete('/:id', [passport.authenticate('jwt', { session: false }), checkRole(['Super Admin', 'Admin'])], serviceController.deleteService);

module.exports = router;
