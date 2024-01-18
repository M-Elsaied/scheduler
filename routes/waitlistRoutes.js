const express = require('express');
const router = express.Router();
const waitlistController = require('../controllers/waitlistController');
const { checkRole } = require('../middleware/auth');
const passport = require('passport');

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Super Admin', 'Admin', 'Staff']),
  waitlistController.createWaitlistEntry
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRole(['Super Admin', 'Admin', 'Staff']),
  waitlistController.getWaitlistEntries
);

module.exports = router;
