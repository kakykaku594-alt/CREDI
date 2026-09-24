// Convenience script for spinning up a fresh database quickly.
// For anything beyond a first deploy, prefer proper migrations
// (sequelize-cli) or running schema.sql directly instead of this.
require('dotenv').config();
const sequelize = require('../services/db');
require('../models/User');
require('../models/CreditScore');
require('../models/CreditCard');
require('../models/Loan');
require('../models/Payment');
require('../models/Notification');

(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced.');
    process.exit(0);
  } catch (err) {
    console.error('Sync failed:', err);
    process.exit(1);
  }
})();
