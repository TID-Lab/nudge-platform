#! /usr/bin/env node

// Just use the command "node populateDB.js" to run!
console.log('This script populates some sample nudges and participants to your database. Check out the sample data at ./sampleData.js');
const Nudge = require('./models/nudge');
const sampleData = require('./sampleData');
const Participant = require('./models/participant');
const AuthUsers = require('./models/authUsers');
const db = require('./util/db');
const dropDatabase = process.env.DROP_DB_ENTRIES || false

/**
 * Creates auth users if they don't exist
 */
async function createAuthUsers() {
  if (dropDatabase) {
    await AuthUsers.remove({})
  }
  const authUser = await AuthUsers.findOne({});
  if (!authUser) {
    try {
      await AuthUsers.create(sampleData.authUserData);
      console.log('created sample authUsers');
    } catch (err) {
      console.log(`${err}`);
    }
  }
}

/**
 * Creates a new admin organization with the
 * default password if one does not already exist.
 */
async function createNudges() {
  if (dropDatabase) {
    await Nudge.remove({})
  }
  const nudges = await Nudge.findOne({});
  if (!nudges) {
    try {
      await Nudge.create(sampleData.nudgeData);
      console.log('created sample nudges');
    } catch (err) {
      console.log(`${err}`);
    }
  }
}

/**
 * Creates a new admin organization with the
 * default password if one does not already exist.
 */
async function createParticipants() {
  if (dropDatabase) {
    await Participant.remove({})
  }
  const nudges = await Participant.findOne({});
  if (!nudges) {
    try {
      await Participant.create(sampleData.participantData);
      console.log('created sample participants');
    } catch (err) {
      console.log(`${err}`);
    }
  }
}

(async () => {
  try {
    // Initialize the database connection
    console.log('connecting to db...');
    await db();
    console.log('connected to db');
    await createAuthUsers();
    console.log('created auth users');
    await createNudges();
    console.log('created nudges');
    await createParticipants();
    console.log('created participants');
  } catch (e) {
    console.log('failed to populate database', e);
  }
})();
