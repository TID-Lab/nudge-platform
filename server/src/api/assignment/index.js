/* eslint-disable */
/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require("express").Router();
const useDebug = require("debug");
const { ObjectId } = require("mongodb");

const debug = useDebug("api");
const Nudge = require("../../models/nudge");
const Participant = require("../../models/participant");
let agenda = require("../../util/agenda.js");
const {
  checkAssignments,
  assignmentCodes,
  dispatchNudges,
} = require("../../util/assignments");

// Checks the participant assignment of an ordered list of a list of nudge assignments
// Input an ordered list of [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]
// i.e. [{nudge_id: 12039, demographics: ['female', '18-29']}, {nudge_id: 1209, demographics: ['asian', 'female'], excluded: [['female', '18-29']]}]
//
// Output (success): [{nudge_id, num_assigned, num_left, success_code}]
// Output (failure object): [{nudge_id, success_code, error_object}]
// NOTE: PREVIOUSLY_ASSIGNED should be handled on the front-end
routes.post("/check", async (req, res) => {
  if (typeof req.body !== "object") {
    res.status(400).send();
    return;
  }
  try {
    const participants = await Participant.find({ active: true });
    const { checkedAssignments, participantMapping } = await checkAssignments(
      req.body,
      participants,
    );
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
routes.post("/assign", async (req, res) => {
  try {
    // May need to format timeToSend
    const { nudges, assignments, isScheduled, timeToSend } = req.body;
    // Checks to see if assignment is valid
    const participants = await Participant.find({ active: true });
    const { checkedAssignments, participantMapping } = await checkAssignments(
      assignments,
      participants,
    );
    if (
      checkedAssignments[checkedAssignments.length - 1].success_code !=
        "SUCCESS" &&
      checkedAssignments[checkedAssignments.length - 1].success_code !=
        "PARTICIPANTS_ALREADY_SENT"
    ) {
      const err_msg = `Something went wrong with the assignments: \n${checkedAssignments}`;
      debug(err_msg);
      res.status(500).send(err_msg);
    }

    let agendaResponse;
    // TODO: CHECK AUTH USER ONE LAST TIME HERE
    const { username } = req.session.authUser;
    if (isScheduled) {
      agendaResponse = await agenda.schedule(timeToSend, "sendNudge", {
        participantMapping,
        nudges,
        username,
      });
    } else {
      agendaResponse = await agenda.now("sendNudge", {
        participantMapping,
        nudges,
        username,
      });
    }

    // nudge: {nudge_msg: str, participant_ids: [ids]}
    // nudge: {nudge_pairs: [{nudge_msg: str, participant_id: id}]}
    res.status(200).send({
      id: agendaResponse.attrs._id.toString(),
      checkedAssignments,
    });
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.get("/", async (req, res) => {
  try {
    const jobs = (await agenda.jobs({ name: "sendNudge" })).map(
      (job) => job.attrs,
    );

    res.status(200).send(jobs);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await agenda.cancel({ _id: ObjectId(id) });

    res.status(200);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.post("/reschedule", async (req, res) => {
  try {
    const jobs = await agenda.jobs({ _id: ObjectId(req.body.the_id) });
    Object.assign(jobs[0].attrs, { nextRunAt: req.body.the_time });
    //jobs[0].attrs.nextRunAt=req.body.the_time
    await jobs[0].save();
    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

module.exports = routes;
