const Participant = require('../models/participant');
const db = require('./db');

const demographic_enum = {
  Age: ['18-29', '30-41', '42-53', '54-65'],
  Race: ['black', 'latinx', 'white', 'asian'],
  Gender: ['female', 'male'],
};

const assignmentCodes = {
  SUCCESS: 'SUCCESS',
  NO_PARTICIPANT: 'NO_PARTICIPANT',
  PREVIOUSLY_ASSIGNED: 'PREVIOUSLY_ASSIGNED',
  ASSIGNMENT_ABOVE_FAILED: 'ASSIGNMENT_ABOVE_FAILED',
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
async function checkAssignments(assignments) {
  const participants = await Participant.find({});
  let participants_inc = []
  let returned = []
  try {
    let remaining = assignments.length;
    for (let i = 0; i < assignments.length; i++) {
      const curr = assignments[i];
      console.log('starting ');
      console.log(curr)
      const { demographics } = curr;
      const num_parti_before = participants.length;
      const prevAssigned = checkPreviouslyAssigned(curr);
      if (!prevAssigned) {
        // FOR EACH PARTICIPANT, CHECK IF label in the included
        let includedDemographics = getIncludedDemographics(demographics);
        for (let parti_idx = 0; parti_idx < participants.length; parti_idx++) {
          if (participants[parti_idx]['labels'].every((element) => includedDemographics.includes(element))) {
            participants_inc.push(...participants.splice(parti_idx, 1));
            parti_idx = parti_idx - 1;
          }
        }
        if (num_parti_before - participants.length == 0) {
          returned.push({nudge_id: curr['nudge_id'], num_assigned: num_parti_before - participants.length, num_left: participants.length, sucess_code: assignmentCodes.NO_PARTICIPANT});
          break;
        } else {
          returned.push({nudge_id: curr['nudge_id'], num_assigned: num_parti_before - participants.length, num_left: participants.length, sucess_code: assignmentCodes.SUCCESS});
        }
        // TODO: excluded demographics
      } else {
        console.log("nudge prev assigned!")
        // TODO: Handle previously assigned
        returned.push(
          {nudge_id: curr['nudge_id'],
          sucess_code: assignmentCodes.PREVIOUSLY_ASSIGNED,
          error_object: {
          potential_num_assigned: 50,
          // Is this ambiguous?
          previously_assigned_errors: [{ demographics: ['female', '18-29'], count: 30 }, { demographics: ['all'], count: 50 }],
        },
        });
        break;
      }
    }

    // Populate the rest of returned 
    while (returned.length < assignments.length) {
      returned.push(
        {
          nudge_id: assignments[returned.length]['nudge_id'],
          sucess_code: assignmentCodes.ASSIGNMENT_ABOVE_FAILED
        })
    }

  } catch (e) {
    console.log(e);
  }
  return returned
}


// Basically if a label is unspecified, then we assume all labels can be "assigned"
// i.e. if we do demographics = ['female', 'black'],
// we want includedDemographics = ['female', 'black', '18-29', '30-41', '42-53', '54-65']
// (and then we can check each participant's demographics against the included list)
function getIncludedDemographics(demographics) {
  const includedDemographics = [...demographics];
  for (const category in demographic_enum) {
    // Checks if there is any overlap (i.e. there exists a demographic label in the age category)
    const contains = demographic_enum[category].some((element) => demographics.includes(element));
    if (!contains) {
      includedDemographics.push(...demographic_enum[category]);
    }
  }
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
  demographic_enum
};
