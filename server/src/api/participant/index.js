// API routes for participants

const routes = require("express").Router();
const useDebug = require("debug");

const debug = useDebug("api");
const Participant = require("../../models/participant");

routes.get("/", async (req, res) => {
  try {
    const participants = await Participant.find({active: true});
    res.status(200).send({ participants });

    return;
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
    return;
  }
});

routes.get("/count", async (req, res) => {
  try {
    const participants = await Participant.find({active: true});
    res.status(200).send({ participantCount: participants.length });
    return;
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
    return;
  }
});

//gets all with inactive participants
routes.get("/partwinactive", async (req, res) => {
  try {
    const participants = await Participant.find({});
    res.status(200).send({ participants });

    return;
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
    return;
  }
});

//this should not be being used right now
routes.post("/upload", async (req, res) => {
  const data = req.body;

  try {
    // TODO: include orphan checking logic here?
    Participant.insertMany(data);

    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.post("/changeState", async (req, res) => {
  const data = req.body;
  debug(data)
  try {
    for (const participantId in data){
      const newActiveValue = data[participantId];
        // Find the participant by participantId
        const filter = {"participantId": participantId };
        // Update the "active" field with the new value
        const updateResult = await Participant.findOneAndUpdate(
          filter,
          { active: newActiveValue },
          {
            new: true, // Return the updated document
          }
        );
        if (updateResult) {
          console.log(`Updated participantId: ${participantId} - active: ${newActiveValue}`);
        } else {
          console.log(`Participant with participantId: ${participantId} not found.`);
        }
    }
    res.status(200).send();

  }
  catch(err){
    debug(`${err}`);
    res.status(500).send(err);

  }

})

module.exports = routes;
