/* eslint-disable no-underscore-dangle */

// API routes for nudges

const routes = require('express').Router();
const useDebug = require('debug');

const debug = useDebug('api');

// Return all nudges
routes.get('/', async (req, res) => {
  try {
    // const nudges = await Nudge.find();
    res.status(200).json([{
      nudge_id: 1,
      message: 'Try testing today!',
      date_created: Date(),
      color: 'red',
      com_b: 'capacity',
      is_active: true,
    },
    {
      nudge_id: 2,
      message: 'Try testing tomorrow!',
      date_created: Date(),
      color: 'green',
      com_b: 'motivation',
      is_active: true,
    },
    ]);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
  }
});

module.exports = routes;
