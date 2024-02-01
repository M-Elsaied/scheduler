const mongoose = require('mongoose');
const Waitlist = require('../models/Waitlist')
const connectDB = require('../../config/database');

async function createIndexes() {
  await connectDB();

  try {
    await Waitlist.createIndexes({ createdAt: 1 });
    console.log('Waitlist indexes created successfully');
  } catch (error) {
    console.error('Error creating Waitlist indexes:', error);
  } finally {
    mongoose.disconnect();
  }
}

createIndexes();
// INPUT_REQUIRED {Ensure the MONGODB_URI in your .env file is correct and points to your MongoDB database.}
