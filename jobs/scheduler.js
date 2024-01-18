const cron = require('node-cron');
const { processWaitlistEntries } = require('./waitlistProcessor');

const waitlistCronJob = () => {
  cron.schedule('0 * * * *', () => {
    console.log(`Cron job started at ${new Date().toISOString()}`);
    processWaitlistEntries();
  });
};

module.exports = {
  waitlistCronJob,
};
