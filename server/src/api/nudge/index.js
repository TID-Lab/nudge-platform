/* eslint-disable */
/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require('express').Router();
const useDebug = require('debug');

const debug = useDebug('api');
const Nudge = require('../../models/nudge');
const Participant = require('../../models/participant');
const { checkAssignments, assignmentCodes } = require('../../util/assignments')

// Return all nudges
routes.get('/', async (req, res) => {
  let nudges;
  try {
    nudges = await Nudge.find({});
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
    return;
  }
  res.status(200).send(nudges);
});

//  REFERENCE models/nudge.js 
//   req.body ~= {
//   message: 'Hello world!',
//   date_created: Date(),
//   color: 'red',
//   com_b: ['motivation', 'capability'],
//   is_active: true,
//   }
routes.post('/', async (req, res) => {
  if (typeof req.body !== 'object') {
    res.status(400).send();
    return;
  }
  try {
    await Nudge.create(req.body);
    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

/**
 * Set is_active to false for an item with :id
 */
routes.patch('/deactivate/:id', async (req, res) => {
  try {
    await Nudge.updateOne({ _id: req.params.id }, { is_active: false })
    res.status(200).send();
  } catch(err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
})

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
    // console.log("THE FOLLOWING SHOULD BE AN ORDERED LIST OF ASSIGNMENTS IN FORM [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]");
    // console.log(req.body);
    const participants = await Participant.find({});
    console.log("HERE 2 !!!!")
    console.log(req.body)
    const checked_assignments = await checkAssignments(req.body, participants);
    res.status(200).send(checked_assignments);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.get('/participantCount', async (req, res) => {
  try {
    const participants = await Participant.find({});
    res.status(200).send({"participantCount": participants.length});
    return;
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
    return;
  }
});

// Final posting method to send out nudges
// Input: an ordered list of (nudge_id, [demographics], [negative demographics]), where the 0th index has the greatest priority 
// Output: Success (200) or error (not covered)
// NOTE: add this to the backend on post history
routes.post('/assign', async (req, res) => {
  try {
    const participants = await Participant.find({});
    let nudges = await Nudge.find({});
    // Attaching the nudge message to the assignments
    const assignments = req.body
    for (let i = 0; i < assignments.length; i++) {
      const nudge_id = assignments[i].nudge_id;
      const nudge = await Nudge.find({_id: nudge_id});
      
      console.log("HERE!!!!")
      console.log(nudge)
    }
    const checked_assignments = await checkAssignments(assignments, participants);
    if (checked_assignments[checked_assignments.length - 1].success_code != 'SUCCESS') {
      const err_msg = `Something went wrong with the assignments: \n${checked_assignments}`
      debug(err_msg);
      res.status(500).send(err_msg);
    }

    // nudge: {nudge_msg: str, participant_ids: [ids]}
    // nudge: {nudge_pairs: [{nudge_msg: str, participant_id: id}]}   
    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});
    // nudge: {nudge_pairs: [{nudge_msg: str, participant_id: id}]}

module.exports = routes;
