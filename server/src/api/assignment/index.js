/* eslint-disable */
/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require('express').Router();
const useDebug = require('debug');

const debug = useDebug('api');
const Nudge = require('../../models/nudge');
const Participant = require('../../models/participant');
let agenda = require('../../util/agenda.js');
const { checkAssignments, assignmentCodes, dispatchNudges } = require('../../util/assignments');


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
    const { checkedAssignments, participantMapping } = await checkAssignments(req.body, participants);
    res.status(200).send(checkedAssignments);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

// Final posting method to send out nudges
// Input: an ordered list of (nudge_id, [demographics], [negative demographics]), where the 0th index has the greatest priority 
// Output: Success (200) or error (not covered)
// NOTE: add this to the backend on post history
routes.post('/assign', async (req, res) => {
  try {
    // May need to format timeToSend
    console.log("=======================")
    console.log(`req body: ${req.body}`)
    const { nudges, assignments, isScheduled, timeToSend } = req.body
    console.log("Assignment given for time: ", timeToSend)
    // Checks to see if assignment is valid
    const participants = await Participant.find({});
    const { checkedAssignments, participantMapping } = await checkAssignments(assignments, participants);

    if (checkedAssignments[checkedAssignments.length - 1].success_code != 'SUCCESS') {
      const err_msg = `Something went wrong with the assignments: \n${checkedAssignments}`
      debug(err_msg);
      res.status(500).send(err_msg);
    }

    let agendaResponse;

    if (isScheduled) {
      agendaResponse = await agenda.schedule(timeToSend, 'sendNudge', participantMapping)
    } else {
      agendaResponse = agenda.now('sendNudge', participantMapping)
    }

    // nudge: {nudge_msg: str, participant_ids: [ids]}
    // nudge: {nudge_pairs: [{nudge_msg: str, participant_id: id}]}   
    res.status(200).send(agendaResponse);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});


routes.get('/', async (req, res) => {
  try {
    const jobs = (await agenda.jobs({name: "sendNudge"})).map(job => job.attrs);

    res.status(200).send(jobs);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.delete('/', async (req, res) => {
  try {
    const jobs = await agenda.jobs();
    // IMPLEMENT DELETE FUNCTIONALITY
    res.status(200).send(jobs);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

module.exports = routes
