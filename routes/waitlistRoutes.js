const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlistController');
const { checkRole } = require('../middleware/auth');
const passport = require('passport');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Super Admin', 'Admin', 'Staff']),
  (req, res) => {
    waitlistController.createWaitlistEntry(req, res);
  }
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Super Admin', 'Admin', 'Staff']),
  (req, res) => {
    waitlistController.getWaitlistEntries(req, res);
  }
);

module.exports = router;
