const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const {userService} = require('../services/')


const createUser = catchAsync(async(req, res) => {
    const user = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(user);
})

const getUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'role', 'restaurantId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options);
    res.send(result);
  });
  
  const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send(user);
  });
  
  const updateUser = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.send(user);
  });
  
  const deleteUser = catchAsync(async (req, res) => {
    await userService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
  });

  module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
  };
// exports.register = async (req, res) => {
//   const { username, email, password, role } = req.body;
//   try {
//     const userExists = await User.findOne({email});
//     if (userExists) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const user = new User({ username, email, password, role });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1d', // Token expires in 1 day
//     });

//     res.status(201).json({
//       message: 'User created successfully',
//       token,
//       userId: user._id,
//       role: user.role,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "User does not exist" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Incorrect password" });
//     }
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: '1d',
//     });
//     res.json({ token, userId: user._id, role: user.role });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
// INPUT_REQUIRED {Make sure JWT_SECRET in your .env file is correct and securely stored}
// INPUT_REQUIRED {Make sure that 'your_jwt_secret' is replaced with the environment variable or the correct JWT secret}
