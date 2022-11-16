/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require('express').Router();
const useDebug = require('debug');

const debug = useDebug('api');
const Nudge = require('../../models/nudge');

const assignmentCodes = {
  SUCCESS: 'SUCCESS',
  NO_PARTICIPANT: 'NO_PARTICIPANT',
  PREVIOUSLY_ASSIGNED: 'PREVIOUSLY_ASSIGNED',
  ASSIGNMENT_ABOVE_FAILED: 'ASSIGNMENT_ABOVE_FAILED',
};

// Return all nudges
routes.get('/', async (req, res) => {
  let nudges;
  try {
    nudges = await Nudge.find({});
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
    return;
  }
  res.status(200).send(nudges);
});

// Checks the participant assignment of an ordered list of a list of nudge assignments
// Input an ordered list of [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]
// i.e. [{nudge_id: 12039, demographics: ['female', '18-29']}, {nudge_id: 1209, demographics: ['asian', 'female'], excluded: [['female', '18-29']]}]
// 
// Output (success): [{nudge_id, num_assigned, num_left, success_code}]
// Output (failure object): [{nudge_id, success_code, error_object}]
// NOTE: PREVIOUSLY_ASSIGNED should be handled on the front-end

routes.post('/check', async (req, res) => {
  try {
    // const nudges = await Nudge.find();
    res.status(200).send([{
      nudge_id: 7,
      num_assigned: 80,
      num_left: 270,
      success_code: assignmentCodes.SUCCESS,
    },
    {
      nudge_id: 12,
      success_code: assignmentCodes.PREVIOUSLY_ASSIGNED,
      error_object: {
        potential_num_assigned: 50,
        // Is this ambiguous?
        previously_assigned_errors: [{ demographics: ['female', '18-29'], count: 30 }, { demographics: ['all'], count: 50 }],
      },
    },
    {
      nudge_id: 3,
      success_code: assignmentCodes.ASSIGNMENT_ABOVE_FAILED,
    },
    {
      nudge_id: 4,
      success_code: assignmentCodes.ASSIGNMENT_ABOVE_FAILED,
    },
    ]);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
  }
});

// Final posting method to send out nudges
// Input: an ordered list of (nudge_id, [demographics], [negative demographics]), where the 0th index has the greatest priority 
// Output: Success (200) or error (not covered)
// NOTE: add this to the backend on post history
routes.post('/assign', async (req, res) => {
  try {
    // const nudges = await Nudge.find();
    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
  }
});

module.exports = routes;
