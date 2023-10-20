const useDebug = require("debug");
const debug = useDebug("core");
const Participant = require("../models/participant");

async function createParticipants(participantData) {
  try {
    for (const participant of participantData) {
      // Find the participant by part_code
      const filter = { participantId: participant.participantId };

      // Update the participant if it exists, or create a new one if it doesn't
      const updateResult = await Participant.findOneAndUpdate(
        filter,
        participant,
        {
          new: true, // Return the updated document
          upsert: true, // Create a new document if it doesn't exist
        }
      );

      if (updateResult) {
        console.log(
          `Updated/created participant with part_code: ${participant.part_code}`
        );
      } else {
        console.log(
          `Failed to update/insert participant with part_code: ${participant.part_code}`
        );
      }
    }

    console.log("Participants creation/updation completed.");
  } catch (err) {
    console.error(`Error creating/updating participants: ${err}`);
  }
}

module.exports = {
  createParticipants,
};
