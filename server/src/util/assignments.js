const db = require("./db");
const axios = require("axios").default;
const useDebug = require("debug");
const debug = useDebug("core");
const Nudge = require("../models/nudge");
const mongoose = require("mongoose");
const { DEMO_ENUM } = require("./constants");

// structure demographics values correctly for the assignment checking algorithm
const demographicEnum = Object.fromEntries(
  Object.entries(DEMO_ENUM).map(([k, v]) => {
    return [k, Array.isArray(v) ? v : Object.values(v)];
  }),
);

const assignmentCodes = {
  SUCCESS: "SUCCESS",
  NO_PARTICIPANT: "NO_PARTICIPANT",
  PREVIOUSLY_ASSIGNED: "PREVIOUSLY_ASSIGNED",
  ASSIGNMENT_ABOVE_FAILED: "ASSIGNMENT_ABOVE_FAILED",
  PARTICIPANTS_ALREADY_SENT: "PARTICIPANTS_ALREADY_SENT",
};

// Checks the participant assignment of an ordered list of a list of nudge assignments
// Input an ordered list of [{nudge_id, [demographics], [(negative demographic pairings), (negative demographic pairings)]}]
// i.e. [{nudge_id: 12039, demographics: ['female', '18-29']}, {nudge_id: 1209, demographics: ['asian', 'female'], excluded: [['female', '18-29']]}]
//
// Output (success): [{nudge_id, num_assigned, num_left, success_code}]
// Output (failure object): [{nudge_id, success_code, error_object}]
// NOTE: PREVIOUSLY_ASSIGNED should be handled on the front-end
// EXAMPLE OUTPUT
// [{
//   nudge_id: 7,
//   num_assigned: 80,
//   num_left: 270,
//   success_code: assignmentCodes.SUCCESS,
// },
// {
//   nudge_id: 12,
//   success_code: assignmentCodes.PREVIOUSLY_ASSIGNED,
//   error_object: {
//     potential_num_assigned: 50,
//     // Is this ambiguous?
//     previously_assigned_errors: [{ demographics: ['female', '18-29'], count: 30 }, { demographics: ['all'], count: 50 }],
//   },
// },
// {
//   nudge_id: 3,
//   success_code: assignmentCodes.ASSIGNMENT_ABOVE_FAILED,
// },
// {
//   nudge_id: 4,
//   success_code: assignmentCodes.ASSIGNMENT_ABOVE_FAILED,
// },
// ]
async function checkAssignments(assignments, participants) {
  let participants_inc = [];
  let returned = [];
  let participantMapping = {};

  try {
    for (let i = 0; i < assignments.length; i++) {
      let alreadySent = {};
      const curr = assignments[i];
      //to pull the history of the nudge
      const nudge = await Nudge.findOne({ _id: curr.nudge_id });
      const num_parti_before = participants.length;
      const prevAssigned = checkPreviouslyAssigned(curr);
      let { demographics } = curr;

      // Just to double check they're lowercase
      demographics = demographics.map((ele) => ele.toLowerCase());

      if (!prevAssigned) {
        // FOR EACH PARTICIPANT, CHECK IF label in the included
        let includedDemographics = getIncludedDemographics(demographics);

        for (let parti_idx = 0; parti_idx < participants.length; parti_idx++) {
          // All labels of this participant need to be in included demographics
          // But this participant must have labels that are selected to assign

          if (
            participants[parti_idx]["labels"].every((element) =>
              includedDemographics.includes(element),
            ) &&
            demographics.every((d) =>
              participants[parti_idx].labels.includes(d),
            )
          ) {
            if (
              nudge.participant_history.includes(
                mongoose.Types.ObjectId(participants[parti_idx]._id),
              ) === false
            ) {
              //only splice the participant when it is assigned (previous design) so in the else clause
              participants_inc.push(...participants.splice(parti_idx, 1));

              const curr_participant =
                participants_inc[participants_inc.length - 1];

              if (
                participantMapping[curr_participant.participantId] != undefined
              ) {
                console.log(
                  "Something went wrong, a participant is being mapped two messages...",
                );
              }

              participantMapping[curr_participant.participantId] =
                curr.nudge_message;
              parti_idx = parti_idx - 1;
            } else {
              const curr_participant = participants[parti_idx];
              alreadySent[curr_participant.participantId] = curr.nudge_message;
            }
          }
        }

        if (
          num_parti_before - participants.length === 0 &&
          Object.keys(alreadySent).length === 0
        ) {
          returned.push({
            nudge_id: curr["nudge_id"],
            num_assigned: num_parti_before - participants.length,
            num_left: participants.length,
            success_code: assignmentCodes.NO_PARTICIPANT,
          });
          break;
        } else if (Object.keys(alreadySent).length != 0) {
          returned.push({
            nudge_id: curr["nudge_id"],
            num_assigned: num_parti_before - participants.length,
            num_left: participants.length,
            overlap: alreadySent,
            success_code: assignmentCodes.PARTICIPANTS_ALREADY_SENT,
          });
        } else {
          returned.push({
            nudge_id: curr["nudge_id"],
            num_assigned: num_parti_before - participants.length,
            num_left: participants.length,
            success_code: assignmentCodes.SUCCESS,
          });
        }
        // TODO: excluded demographics
      } else {
        console.log("nudge prev assigned!");
        // TODO: Handle previously assigned
        returned.push({
          nudge_id: curr["nudge_id"],
          success_code: assignmentCodes.PREVIOUSLY_ASSIGNED,
          error_object: {
            potential_num_assigned: 50,
            // Is this ambiguous?
            previously_assigned_errors: [
              { demographics: ["female", "18-29"], count: 30 },
              { demographics: ["all"], count: 50 },
            ],
          },
        });
        break;
      }
    }

    // Populate the rest of returned
    while (returned.length < assignments.length) {
      returned.push({
        nudge_id: assignments[returned.length]["nudge_id"],
        success_code: assignmentCodes.ASSIGNMENT_ABOVE_FAILED,
      });
    }
  } catch (e) {
    console.log(e);
  }

  return {
    checkedAssignments: returned,
    participantMapping: participantMapping,
  };
}

async function dispatchNudges(participantMapping, sender) {
  const responsePromises = [];
  // SHOULD BE EDITED FOR REAL URL
  const endpoint = "https://peach2nudge.ipat.gatech.edu/api/nudges/";

  Object.keys(participantMapping).forEach((participant) => {
    console.log(
      `Sending participant id ${participant} the following message: ${participantMapping[participant]}`,
    );
    // HTTP get request
    debug(
      `Sending participant id ${participant} the following message: ${participantMapping[participant]}`,
    );
    const resPromise = axios
      .post(
        endpoint,
        {
          recipient: participant,
          mesg: participantMapping[participant],
          sender: sender,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .catch((err) => {
        console.log(`Issue sending nudge, ${err}`);
      });
    responsePromises.push(resPromise);
  });

  const responses = await Promise.all(responsePromises);
  //console.log(responses);
  // Log/store the responses somehow?
  return responses;
}

// Basically if a label is unspecified, then we assume all labels can be "assigned"
// i.e. if we do demographics = ['female', 'black'],
// we want includedDemographics = ['female', 'black', '18-29', '30-41', '42-53', '54-65']
// (and then we can check each participant's demographics against the included list)
function getIncludedDemographics(demographics) {
  const includedDemographics = [...demographics];

  Object.keys(demographicEnum).forEach((category) => {
    // Checks if there is any overlap (e.g. there exists a demographic label in the age category)
    const contains = demographicEnum[category].some((element) =>
      demographics.includes(element),
    );

    // Make exception to add all diabete category labels since they are not mutually exclusive
    if (!contains || category === "Diabetes") {
      includedDemographics.push(...demographicEnum[category]);
    }
  });

  return includedDemographics;
}

// TODO
function checkPreviouslyAssigned(assignment) {
  return false;
}

// THIS IS FOR TESTING
// (async () => {
//   try {
//     // Initialize the database connection
//     console.log('connecting to db...');
//     await db();
//     console.log('connected to db');
//     const a = await checkAssignments([{nudge_id: 12039, demographics: ['female', '18-29']}, {nudge_id: 1209, demographics: ['asian', 'female'], excluded: [['female', '18-29']]}, {nudge_id: 12039, demographics: ['female', '18-29']}, {nudge_id: 12039, demographics: ['female', '18-29']}]);
//     console.log('checked assignments');
//     console.log(a);
//   } catch (e) {
//     console.log('failed to populate database', e);
//   }
// })();

module.exports = {
  checkAssignments,
  assignmentCodes,
  demographicEnum,
  dispatchNudges,
};
