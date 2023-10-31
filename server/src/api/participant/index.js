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

module.exports = routes;
