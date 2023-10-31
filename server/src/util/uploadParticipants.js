const useDebug = require("debug");
const debug = useDebug("core");
const Participant = require("../models/participant");

async function createParticipantsUpload(participantData) {
  try {
    for (const participant of participantData) {
      // Find the participant by participantId (make sure it matches your MongoDB schema)
      const filter = { participantId: participant.participantId };
      //curent implementation will allow the updating of an inactive participant but will not allow the changing of status via upload

      // Update the participant if it exists, or create a new one if it doesn't
      const updateResult = await Participant.findOneAndUpdate(
        filter,
        participant,
        {
          new: true, // Return the updated document
          upsert: true, // Create a new document if it doesn't exist
          setDefaultsOnInsert:true,
        }
      );

      if (updateResult) {
        console.log(
          `Updated/created participant with participantId: ${participant.participantId}`
        );
      } else {
        console.log(
          `Failed to update/insert participant with participantId: ${participant.participantId}`
        );
      }
    }

    console.log("Participants creation/updation completed.");
  } catch (err) {
    console.error(`Error creating/updating participants: ${err}`);
  }
}

module.exports = {
  createParticipantsUpload,
};
