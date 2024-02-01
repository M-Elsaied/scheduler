const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {roles} = require('../config/roles');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');


const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    // required: true,
    enum: roles,
    default: 'doctor'
    // ['Super Admin', 'Admin', 'Staff', 'Doctor', 'Patient']
  },
  location: {
		street: String,
		zipcode: String,
		city: String,
		state: String,
	},
  // locations: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Location'
  // }]
}, {
  timestamps: true
});

userSchema.plugin(passportLocalMongoose)

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});


/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
