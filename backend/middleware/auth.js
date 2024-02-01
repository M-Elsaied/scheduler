const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService')


const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  

  if (requiredRights) {

    const userRights = roleRights.get(user.role);
    console.log(user.role)
    console.log(userRights, 'it hit');
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};


const checkRole =
  (...requiredRights) =>
  // console.log(...requiredRights, 'see rr')
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      // console.log('check role hit', ...requiredRights)
      passport.authenticate('local', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = checkRole;

// const checkRole = (roles) => async (req, res, next) => {
//   try {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await userService.findOne({
//       _id: decoded.id
//     });

//     // if (!user || !roles.includes(user.role)) {
//     //   throw new Error('Not authorized');
//     // }
//     if (!user || !roles.includes(user.role)) {
//       throw new Error('Not authorized');
//     }

//     req.user = user;
//     req.token = token;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: 'Please authenticate.' });
//   }
// };

// module.exports = { checkRole };