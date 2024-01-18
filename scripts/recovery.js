const { exec } = require('child_process');
const path = require('path');

const backupPath = process.argv[2] || path.join(__dirname, '../backups/latest-backup');

exec(`mongorestore --uri="${process.env.MONGODB_URI}" --drop ${backupPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Recovery error: ${error}`);
    return;
  }
  console.log(`Recovery successful! Data restored from ${backupPath}`);
});
// INPUT_REQUIRED {Ensure the MONGODB_URI in your .env file is correct and points to your MongoDB database. Provide the correct path to the backup directory.}
