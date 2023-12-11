/* eslint-disable */
/* eslint-disable no-underscore-dangle */

// API routes for sending analytics data

const routes = require("express").Router();
const useDebug = require("debug");
const fs = require('fs');
const debug = useDebug("api");

routes.get("/combtopics", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/topics_dash.csv');
    stream.pipe(res);

    stream.on('end', () => {
      console.log('Stream ended successfully');
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.get("/combposts", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/content_dash.csv');
    stream.pipe(res);

    stream.on('end', () => {
      console.log('Stream ended successfully');
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.get("/combengagement", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/engagement_comb.csv');
    stream.pipe(res);

    stream.on('end', () => {
      console.log('Stream ended successfully');
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

routes.get("/topicengagement", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/topic_engagement.csv');
    stream.pipe(res);

    stream.on('end', () => {
      console.log('Stream ended successfully');
    });

    stream.on('error', (err) => {
      console.error('Stream error:', err);
    });
  } catch (err) {
    debug(`${err}`);
    res.status(500).send(err);
  }
});

module.exports = routes;