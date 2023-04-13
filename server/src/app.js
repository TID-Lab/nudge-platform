const useDebug = require('debug');
const chalk = require('chalk');
const db = require('./util/db');
const api = require('./api');
const { createAdminOrganization } = require('./util/org');
const AuthUsers = require('./models/authUsers');

const debug = useDebug('core');

/**
 * Initializes each primary module of the system.
 */

(async () => {
  debug('Initializing system...');

  try {
  // Initialize the database connection
    await db();

    const usrsFromDB = await AuthUsers.findOne({username: 'jw199'});
    debug(`User: ${usrsFromDB}`);

    // Initialize the API
    await api();

    // Create the default admin org if one does not exist
    await createAdminOrganization();

    debug(chalk.greenBright('System initialized.'));
  } catch (e) {
    debug(chalk.redBright('Initialization failed.'));
  }
})();
