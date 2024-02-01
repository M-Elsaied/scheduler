const express = require('express');
const validate = require('../middleware/validate')
// const validate = require('../../middlewares/validate');
const authValidation = require('../validation/auth.validation')
// const authValidation = require('../../validations/auth.validation');
// const authController = require('../../controllers/auth.controller');
const authController  = require('../controllers/authController')
const auth = require('../middleware/auth')
// const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.get('/profile', auth(), authController.profile);
router.patch('/profile-update', auth(), validate(authValidation.update), authController.profileUpdate);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { checkRole } = require('../middleware/auth');

// router.post('/register', (req, res) => {
//   authController.register(req, res);
// });

// router.post('/login', (req, res) => {
//   authController.login(req, res);
// });

// // Example protected route
// router.get('/protected', checkRole(['Admin', 'Super Admin']), (req, res) => {
//   res.status(200).send('You have access to the protected route.');
// });

// module.exports = router;
