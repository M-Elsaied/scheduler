const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkRole } = require('../middleware/auth');

router.post('/register', (req, res) => {
  authController.register(req, res);
});

router.post('/login', (req, res) => {
  authController.login(req, res);
});

// Example protected route
router.get('/protected', checkRole(['Admin', 'Super Admin']), (req, res) => {
  res.status(200).send('You have access to the protected route.');
});

module.exports = router;
