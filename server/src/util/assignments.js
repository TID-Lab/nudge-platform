const db = require("./db");
const axios = require("axios").default;
const useDebug = require("debug");
const debug = useDebug("core");
const Nudge = require("../models/nudge");
const mongoose = require("mongoose");


const demographic_enum = {
  Age: ["18-29", "30-40", "41-50", "51-64", "65+"],
  Race: ["black", "latinx", "white", "asian", "native-american"],
  Gender: ["female", "male", "non-binary"],
  Diabetes: ["has-diabetes", "at-risk", "caretaker"],
  TestingStatus: ["tested", "untested"],
};

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
      debug("this is curr nudge info")
      debug(curr)
      //to pull the history of the nudge
      const nudge = await Nudge.findOne({ _id: curr.nudge_id });
      debug(nudge)
      let { demographics } = curr;
      // Just to double check they're lowercase
      demographics = demographics.map((ele) => ele.toLowerCase());
      const num_parti_before = participants.length;
      const prevAssigned = checkPreviouslyAssigned(curr);
      if (!prevAssigned) {
        // FOR EACH PARTICIPANT, CHECK IF label in the included
        let includedDemographics = getIncludedDemographics(demographics);
        console.log(includedDemographics);
        for (let parti_idx = 0; parti_idx < participants.length; parti_idx++) {
          console.log(participants[parti_idx]["labels"]);
          if (
            participants[parti_idx]["labels"].every((element) =>
              includedDemographics.includes(element)
            )
          ) {
            if(nudge.participant_history.includes(mongoose.Types.ObjectId(participants[parti_idx]._id))===false) {
              participants_inc.push(...participants.splice(parti_idx, 1));
              const curr_participant =
                participants_inc[participants_inc.length - 1];
              if (
                participantMapping[curr_participant.participantId] != undefined
              ) {
                console.log(
                  "Something went wrong, a participant is being mapped two messages..."
                );
              }
              participantMapping[curr_participant.participantId] =
                curr.nudge_message;
              parti_idx = parti_idx - 1;
            }
            else {
              const curr_participant=participants.splice(parti_idx, 1)[0];
              alreadySent[curr_participant.participantId]=curr.nudge_message
              parti_idx = parti_idx - 1;
            }
          }
        }
        console.log("already sent", alreadySent)
        if (num_parti_before - participants.length == 0) {
          returned.push({
            nudge_id: curr["nudge_id"],
            num_assigned: num_parti_before - participants.length,
            num_left: participants.length,
            success_code: assignmentCodes.NO_PARTICIPANT,
          });
          break;
        } else if(Object.keys(alreadySent).length!=0){
          returned.push({
            nudge_id: curr["nudge_id"],
            num_assigned: num_parti_before - participants.length,
            num_left: participants.length,
            overlap: alreadySent,
            success_code: assignmentCodes.PARTICIPANTS_ALREADY_SENT,
          });
        }
        else {
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
      `Sending participant id ${participant} the following message: ${participantMapping[participant]}`
    );
    // HTTP get request
    debug(
      `Sending participant id ${participant} the following message: ${participantMapping[participant]}`
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
        }
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

  Object.keys(demographic_enum).forEach((category) => {
    // Checks if there is any overlap (i.e. there exists a demographic label in the age category)
    const contains = demographic_enum[category].some((element) =>
      demographics.includes(element)
    );
    if (!contains) {
      includedDemographics.push(...demographic_enum[category]);
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
  demographic_enum,
  dispatchNudges,
};
