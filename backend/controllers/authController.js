const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const ApiError = require('../utils/ApiError');
const sendEmail = require('../utils/notifications')


const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  console.log(user, 'see user')
  const tokens = await tokenService.generateAuthTokens(user);
  console.log(tokens, 'tuest')
  res.status(httpStatus.CREATED).send({ user });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  console.log(user);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  const subject = 'Email Verification';
  const verificationEmailUrl = `http://localhost:3001/v1/auth/verify-email?token=${verifyEmailToken}`

    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail.sendEmail(req.user.email, subject, text)
//   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const profile = catchAsync(async (req, res) => {
  const user = await userService.getUserByIdwithRes(req.user._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  res.send(user);
});

const profileUpdate = catchAsync(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Profile not found');
  }
  res.send(user);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  profile,
  profileUpdate,
};
