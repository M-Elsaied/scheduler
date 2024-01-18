const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({email});
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// INPUT_REQUIRED {Make sure JWT_SECRET in your .env file is correct and securely stored}
// INPUT_REQUIRED {Make sure that 'your_jwt_secret' is replaced with the environment variable or the correct JWT secret}
