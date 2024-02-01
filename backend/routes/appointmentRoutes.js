const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { checkDoubleBooking, checkWorkingHours, validateDoctorAvailability } = require('../middleware/appointmentRules');
const { checkRole } = require('../middleware/auth');
const passport = require('passport');

//need to add validateDoctorAvailability

router.post(
  '/',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Doctor', 'Admin', 'Super Admin', 'Staff'])(req, res, () => {
        checkDoubleBooking(req, res, () => {
          checkWorkingHours(req, res, () => {
            validateDoctorAvailability(req, res, () => {
            appointmentController.createAppointment(req, res);
            });
          });
        });
      });
    });
  }
);

router.get(
  '/',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Doctor', 'Admin', 'Super Admin', 'Staff'])(req, res, () => {
        appointmentController.getAppointments(req, res);
      });
    });
  }
);

router.put(
  '/:id',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Doctor', 'Admin', 'Super Admin'])(req, res, () => {
        checkDoubleBooking(req, res, () => {
          checkWorkingHours(req, res, () => {
            validateDoctorAvailability(req, res, () => {
              appointmentController.updateAppointment(req, res);
           });
          });
        });
      });
    });
  }
);

router.delete(
  '/:id',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Doctor', 'Admin', 'Super Admin'])(req, res, () => {
        appointmentController.deleteAppointment(req, res);
      });
    });
  }
);

router.get(
  '/search',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Super Admin', 'Admin', 'Staff'])(req, res, () => {
        appointmentController.searchAppointments(req, res);
      });
    });
  }
);

module.exports = router;
