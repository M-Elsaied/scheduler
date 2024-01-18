const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { checkDoubleBooking, checkWorkingHours } = require('../middleware/appointmentRules');
const { checkRole } = require('../middleware/auth');
const passport = require('passport');

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Doctor', 'Admin', 'Super Admin']),
  checkDoubleBooking,
  checkWorkingHours,
  appointmentController.createAppointment
);

// router.get('/',
//   passport.authenticate('jwt', { session: false }),
//   checkRole(['Doctor', 'Admin', 'Super Admin', 'Staff']),
//   appointmentController.getAppointments
// );
router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Doctor', 'Admin', 'Super Admin']),
  checkDoubleBooking,
  checkWorkingHours,
  appointmentController.updateAppointment
);
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Doctor', 'Admin', 'Super Admin']),
  appointmentController.deleteAppointment
);
router.get('/search',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Super Admin', 'Admin', 'Staff']),
  appointmentController.searchAppointments
);

module.exports = router;
