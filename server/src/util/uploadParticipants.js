const useDebug = require("debug");
const debug = useDebug("core");
const Participant = require("../models/participant");

async function createParticipants(participantData) {
  console.log(`Object ${participantData} `);
  if (true) {
    await Participant.remove({});
  }
  const nudges = await Participant.findOne({});
  if (!nudges) {
    try {
      await Participant.create(participantData);
      console.log("created sample participants");
    } catch (err) {
      console.log(`${err}`);
    }
  }
}

module.exports = {
  createParticipants,
};
