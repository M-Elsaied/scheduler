const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkRole = (roles) => async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id
    });
    console.log('I am here...');

    if (!user || !roles.includes(user.role)) {
      throw new Error('Not authorized');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = { checkRole };