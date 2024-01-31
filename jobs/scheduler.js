const cron = require('node-cron');
const { processWaitlistEntries } = require('./waitlistProcessor');

const waitlistCronJob = () => {
  try {
    cron.schedule('0 * * * *', () => {
      console.log(`Cron job started at ${new Date().toISOString()}`);
      processWaitlistEntries();
    });
  } catch (error) {
    console.error('Error initializing cron job:', error);
  }
};

module.exports = {
  waitlistCronJob,
};
