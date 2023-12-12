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

routes.get("/engagementposts", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/engagement_posts.csv');
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

routes.get("/engagementcomments", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/engagement_comments.csv');
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

routes.get("/weeklytopics", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/updated_topics.csv');
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

routes.get("/weeklyposts", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/updated_posts.csv');
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

routes.get("/liwccomponents", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/liwc_components.csv');
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

routes.get("/liwctopics", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/liwc_topics.csv');
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

routes.get("/liwcposts", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/liwc_posts.csv');
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

routes.get("/liwccomments", async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    const stream = fs.createReadStream('./data/liwc_comments.csv');
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
