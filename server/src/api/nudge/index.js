/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require('express').Router();
const useDebug = require('debug');

const debug = useDebug('api');
const Nudge = require('../../models/nudge');

// Return all nudges
routes.get('/', async (req, res) => {
  let nudges;
  try {
    nudges = await Nudge.find({});
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
    return;
  }
  res.status(200).send(nudges);
});

module.exports = routes;
