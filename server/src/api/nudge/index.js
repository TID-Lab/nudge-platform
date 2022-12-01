/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require('express').Router();
const useDebug = require('debug');

const debug = useDebug('api');
const Nudge = require('../../models/nudge');
const { checkAssignments, assignmentCodes } = require('../../util/assignments')

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
  if (typeof req.body !== 'object') {
    res.status(400).send();
    return;
  }
  try {
    console.log("THE FOLLOWING SHOULD BE AN ORDERED LIST OF ASSIGNMENTS IN FORM [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]");
    console.log(req.body);
    const checked_assignments = await checkAssignments(req.body);
    res.status(200).send(checked_assignments);
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
    const checked_assignments = await checkAssignments(req.body);


    // nudge: {nudge_msg: str, participant_ids: [ids]}
    // nudge: {nudge_pairs: [{nudge_msg: str, participant_id: id}]}   
    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
  }
});
    // nudge: {nudge_pairs: [{nudge_msg: str, participant_id: id}]}   

module.exports = routes;
