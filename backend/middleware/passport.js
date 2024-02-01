const passport = require('passport');
const passportConfig = require('../config/passport');

module.exports = app => {
  app.use(passport.initialize());
  passportConfig(passport);
};
