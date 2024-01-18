const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { checkRole } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Example protected route
router.get('/protected', checkRole(['Admin', 'Super Admin']), (req, res) => {
  res.status(200).send('You have access to the protected route.');
});

module.exports = router;
