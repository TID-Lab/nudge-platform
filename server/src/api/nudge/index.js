/* eslint-disable */
/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require("express").Router();
const useDebug = require("debug");

const debug = useDebug("api");
const Nudge = require("../../models/nudge");
const Participant = require("../../models/participant");
let agenda = require("../../util/agenda.js");

// Return all nudges
routes.get("/", async (req, res) => {
  let nudges;
  try {
    nudges = await Nudge.find({});
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
    return;
  }
  res.status(200).send(nudges);
});

//  REFERENCE models/nudge.js
//   req.body ~= {
//   message: 'Hello world!',
//   date_created: Date(),
//   color: 'red',
//   com_b: ['motivation', 'capability'],
//   is_active: true,
//   }
routes.post("/", async (req, res) => {
  if (typeof req.body !== "object") {
    res.status(400).send();
    return;
  }
  try {
    await Nudge.create(req.body);
    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

/**
 * Set is_active to false for an item with :id
 */
routes.patch("/deactivate/:id", async (req, res) => {
  try {
    await Nudge.updateOne({ _id: req.params.id }, { is_active: false });
    res.status(200).send();
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.get("/participantCount", async (req, res) => {
  try {
    const participants = await Participant.find({});
    res.status(200).send({ participantCount: participants.length });
    return;
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
    return;
  }
});

module.exports = routes;
