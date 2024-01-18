const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupPath = path.join(__dirname, '../backups');
const timestamp = new Date().toISOString().split('.')[0].replace(/[-T:]/g, '');
const finalBackupPath = path.join(backupPath, `backup-${timestamp}`);

if (!fs.existsSync(backupPath)) {
  fs.mkdirSync(backupPath, { recursive: true });
}

exec(`mongodump --uri="${process.env.MONGODB_URI}" --out=${finalBackupPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup error: ${error}`);
    return;
  }
  console.log(`Backup successful! Data saved to ${finalBackupPath}`);
});
// INPUT_REQUIRED {Ensure the MONGODB_URI in your .env file is correct and points to your MongoDB database.}
