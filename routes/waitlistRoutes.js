const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlistController');
const { checkRole } = require('../middleware/auth');
const passport = require('passport');

router.post(
  '/',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Super Admin', 'Admin', 'Staff'])(req, res, () => {
        waitlistController.createWaitlistEntry(req, res);
      });
    });
  }
);


router.get(
  '/',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Super Admin', 'Admin', 'Staff'])(req, res, () => {
        waitlistController.getWaitlistEntries(req, res);
      });
    });
  }
);

router.delete(
  '/:id',
  (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
      checkRole(['Super Admin', 'Admin', 'Staff'])(req, res, () => {
        waitlistController.deleteWaitlistEntry(req, res);
      });
    });
  }
);

module.exports = router;
