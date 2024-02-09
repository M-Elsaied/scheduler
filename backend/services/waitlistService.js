const Waitlist = require('../models/waitlist'); // Adjust the path as needed
const httpStatus = require('http-status');
// const config = require('../config/config');

const processWaitlist = async(provider, appointmentTime, location) => {
  console.log('it hit external')
    try {
        const waitlistEntries = await Waitlist.find({
          provider,
          location,
          status: 'Pending',
          appointmentTime: { $lte: appointmentTime } // Process only if appointment time is less than or equal
        }).sort({ createdAt: 1 });
        console.log(waitlistEntries, 'see entries')
    
        // Process the waitlist entries
        for (const entry of waitlistEntries) {
          const { patient, service, location: entryLocation } = entry;
    
          // Check if the provider is available for the specified time slot
          const isProviderAvailable = await checkProviderAvailability(provider, appointmentTime, location);
    
          if (isProviderAvailable) {
            // Create an appointment for the patient
            await createAppointment(patient, provider, appointmentTime, service, entryLocation);
    
            // Update the status of the waitlist entry
            entry.status = 'Processed';
            await entry.save();
    
            // Notify the patient or perform any additional actions
            console.log(`Appointment created for patient ${patient} at ${appointmentTime}`);
          }
        }
      } catch (error) {
        console.error('Error processing waitlist:', error);
      }
}


/**
 * Create a location
 * @param {Object} waitlistBody
 * @returns {Promise<Waitlist>}
 */
const createWaitlistEntry = async(waitlistBody) => {
    return Waitlist.create(waitlistBody)
}

/**
 * Query for deliveries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getWaitlistEntries = async() => {
    // try {
        const waitlistEntries = await Waitlist.find({}).sort({ createdAt: 1 });
        return waitlistEntries;
        // res.status(200).json(waitlistEntries);
    //   } catch (error) {
    //     console.error('Error retrieving waitlist entries:', error);
    //     res.status(500).json({ error: error.message });
    //   }
}

/**
 * Delete subscription by id
 * @param {ObjectId} waitlistEntryId
 * @returns {Promise<Waitlist>}
 */
const deleteWaitlistEntry = async(waitlistEntryId) => {
    // try {
        // const waitlistEntryId = req.params.id;
        const waitlistEntry = await Waitlist.findById(waitlistEntryId);
    
        if (!waitlistEntry) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Waitlist entry not found.');
        }
    
        if (waitlistEntry.status === 'Processed') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot delete processed waitlist entries.');
        }
    
        return await waitlistEntry.remove();
        // res.status(200).json({ message: 'Waitlist entry deleted successfully.' });
    //   } catch (error) {
    //     console.error('Error deleting waitlist entry:', error);
    //     res.status(500).json({ error: error.message });
    //   }
}

module.exports = {
    processWaitlist,
    createWaitlistEntry,
    getWaitlistEntries,
    deleteWaitlistEntry
}





// const createWaitlistEntry = async()



// exports.processWaitlist = async (provider, appointmentTime, location) => {
//   try {
//     const waitlistEntries = await Waitlist.find({
//       provider,
//       location,
//       status: 'Pending',
//       appointmentTime: { $lte: appointmentTime } // Process only if appointment time is less than or equal
//     }).sort({ createdAt: 1 });

//     // Process the waitlist entries
//     for (const entry of waitlistEntries) {
//       const { patient, service, location: entryLocation } = entry;

//       // Check if the provider is available for the specified time slot
//       const isProviderAvailable = await checkProviderAvailability(provider, appointmentTime, location);

//       if (isProviderAvailable) {
//         // Create an appointment for the patient
//         await createAppointment(patient, provider, appointmentTime, service, entryLocation);

//         // Update the status of the waitlist entry
//         entry.status = 'Processed';
//         await entry.save();

//         // Notify the patient or perform any additional actions

//         console.log(`Appointment created for patient ${patient} at ${appointmentTime}`);
//       }
//     }
//   } catch (error) {
//     console.error('Error processing waitlist:', error);
//   }
// };


// exports.createWaitlistEntry = async (req, res) => {
//   try {
//     const newWaitlistEntry = new Waitlist({
//       patient: req.body.patient,
//       provider: req.body.provider,
//       service: req.body.service,
//       location: req.body.location,
//       appointmentTime: req.body.appointmentTime // Include the appointment time

//     });

//     await newWaitlistEntry.save();

//     res.status(201).json({
//       message: 'Waitlist entry created successfully.',
//       waitlistEntry: newWaitlistEntry
//     });
//   } catch (error) {
//     console.error('Error creating waitlist entry:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getWaitlistEntries = async (req, res) => {
//   try {
//     const waitlistEntries = await Waitlist.find({}).sort({ createdAt: 1 });
//     res.status(200).json(waitlistEntries);
//   } catch (error) {
//     console.error('Error retrieving waitlist entries:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteWaitlistEntry = async (req, res) => {
//   try {
//     const waitlistEntryId = req.params.id;
//     const waitlistEntry = await Waitlist.findById(waitlistEntryId);

//     if (!waitlistEntry) {
//       return res.status(404).json({ message: 'Waitlist entry not found.' });
//     }

//     if (waitlistEntry.status === 'Processed') {
//       return res.status(400).json({ message: 'Cannot delete processed waitlist entries.' });
//     }

//     await waitlistEntry.remove();

//     res.status(200).json({ message: 'Waitlist entry deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting waitlist entry:', error);
//     res.status(500).json({ error: error.message });
//   }
// };





// const jwt = require('jsonwebtoken');
// const moment = require('moment');
// const httpStatus = require('http-status');
// const config = require('../config/config');
// const userService = require('./userService');
// // const { Token } = require('../models');
// // const { Token } = require('../models/Token')
// const ApiError = require('../utils/ApiError');
// const { tokenTypes } = require('../config/tokens');
// const Token = require('../models/Token');


// /**
//  * Generate token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {string} [secret]
//  * @returns {string}
//  */
// const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
//   const payload = {
//     sub: userId,
//     iat: moment().unix(),
//     exp: expires.unix(),
//     type,
//   };
//   return jwt.sign(payload, secret);
// };

// /**
//  * Save a token
//  * @param {string} token
//  * @param {ObjectId} userId
//  * @param {Moment} expires
//  * @param {string} type
//  * @param {boolean} [blacklisted]
//  * @returns {Promise<Token>}
//  */
// const saveToken = async (token, userId, expires, type, blacklisted = false) => {
//   console.log('issue log')
//   const tokenDoc = await Token.create({
//     token,
//     user: userId,
//     expires: expires.toDate(),
//     type,
//     blacklisted,
//   });
//   return tokenDoc;
// };

// /**
//  * Verify token and return token doc (or throw an error if it is not valid)
//  * @param {string} token
//  * @param {string} type
//  * @returns {Promise<Token>}
//  */
// const verifyToken = async (token, type) => {
//   const payload = jwt.verify(token, config.jwt.secret);
//   const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
//   if (!tokenDoc) {
//     throw new Error('Token not found');
//   }
//   return tokenDoc;
// };

// /**
//  * Generate auth tokens
//  * @param {User} user
//  * @returns {Promise<Object>}
//  */
// const generateAuthTokens = async (user) => {
//   const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
//   const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

//   const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
//   const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
//   await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);


//   return {
//     access: {
//       token: accessToken,
//       expires: accessTokenExpires.toDate(),
//     },
//     refresh: {
//       token: refreshToken,
//       expires: refreshTokenExpires.toDate(),
//     },
//   };
// };

// /**
//  * Generate reset password token
//  * @param {string} email
//  * @returns {Promise<string>}
//  */
// const generateResetPasswordToken = async (email) => {
//   const user = await userService.getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
//   }
//   const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
//   const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
//   await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
//   return resetPasswordToken;
// };

// /**
//  * Generate verify email token
//  * @param {User} user
//  * @returns {Promise<string>}
//  */
// const generateVerifyEmailToken = async (user) => {
//   const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
//   const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
//   return verifyEmailToken;
// };

// module.exports = {
//   generateToken,
//   saveToken,
//   verifyToken,
//   generateAuthTokens,
//   generateResetPasswordToken,
//   generateVerifyEmailToken,
// };
