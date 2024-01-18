const mongoose = require('mongoose');
const connectDB = require('./config/database');

connectDB();

mongoose.connection.on('connected', () => {
  const db = mongoose.connection.db;
  db.createIndexes('appointments', [
    { key: { 'provider': 1, 'startTime': 1, 'service': 1, 'location': 1 }, name: 'appointment_search_index' }
  ])
    .then(() => {
      console.log('Indexes created successfully');
      mongoose.disconnect();
    })
    .catch(error => {
      console.error('Error creating indexes:', error);
      mongoose.disconnect();
    });
});

// INPUT_REQUIRED {Ensure the MONGODB_URI in your .env file is correct and points to your MongoDB database.}
