// API routes for user authentication
const _ = require("lodash");

const useDebug = require("debug");
const session = require("express-session");
const routes = require("express").Router();
var CASAuthentication = require("node-cas-authentication");
const AuthUsers = require("../../models/authUsers");
const Organization = require("../../models/organization");
const { comparePassword } = require("../../util/org");
const oauth = require("../../util/oauth-promise")(
  process.env.CALLBACK_URL ||
    "https://peach.ipat.gatech.edu/social-media-dashboard",
);
const debug = useDebug("api");
const casServiceUrl =
  process.env.NODE_ENV === "production"
    ? "https://peach2.ipat.gatech.edu/api/auth"
    : "http://localhost:3000/api/auth";

var cas = new CASAuthentication({
  cas_version: "3.0",
  cas_url: "https://sso.gatech.edu/cas",
  service_url: casServiceUrl,
  // http://localhost:5001//authenticate?ticket=ST-22282-eGZSy6F17H9uBnQGQoF7x-eXJE4-ip-10-128-1-139
});

routes.get("/caslogin", async (req, res, next) => {
  debug(`query: ${JSON.stringify(req.query)}`);
  debug(`session: ${JSON.stringify(req.session)}`);
  debug(`next: ${JSON.stringify(next)}`);

  req.session.role = undefined;
  req.session.authUser = undefined;
  req.session.cas_return_to = "/api/auth/caslogin";

  if (!("cas_user" in req.session)) {
    debug("NOT logged in. Time for CAS redirect!");
    // req.query.redirectTo = 'bob';
    cas.bounce_redirect(req, res, next);
    return;
  }

  const casUser = req.session.cas_user;
  debug(`USER: ${casUser}`);

  let authUser;
  try {
    authUser = await AuthUsers.findOne({ username: casUser });
    //authUser = null; // TODO testing to remove
    if (!authUser) {
      debug(`CASUser ${casUser} not found in db!`);
      delete req.session.cas_user;
      delete req.session.authUser;
      //res.status(401).send();
      res.redirect("/");
      return;
    }
    req.session.authUser = authUser;
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
    return;
  }

  req.session.role = authUser.role;

  res.redirect("/");
  //res.status(200).send();
});

routes.get("/caslogout", async (req, res) => {
  debug("caslogout called");
  delete req.session.cas_user;
  //req.session.role = undefined;
  req.session.authUser = undefined;
  req.session.cas_user = undefined;
  // res.redirect('/');
  res.status(200).send();
});

routes.get("/cascheck", async (req, res) => {
  debug("/cascheck called");
  if (!_.has(req, "session")) {
    res.status(401).send();
    return;
  }
  debug(`Session: ${JSON.stringify(req.session)}`);

  if (!_.has(req.session, "authUser")) {
    res.status(401).send();
    return;
  }
  const { authUser } = req.session;
  debug(`authUser: ${JSON.stringify(authUser)}`);

  if (!_.has(authUser, "username")) {
    res.status(401).send();
    return;
  }

  const { username } = authUser;

  try {
    const usrFromDB = await AuthUsers.findOne({ username });

    if (!usrFromDB) {
      debug(`Auth User ${username} not found in db!`);
      delete req.session.authUser;
      delete req.session.cas_user;
      res.status(401).send();
      return;
    }
    req.session.authUser = authUser;
  } catch (err) {
    debug(`${err}`);
    delete req.session.authUser;
    delete req.session.cas_user;
    res.status(500).send();
    return;
  }
  if (!_.has(authUser, "role")) {
    res.status(401).send();
    return;
  }
  const { role } = authUser;
  if (!(role === "basic" || role === "admin")) {
    debug("cascheck is returning failure!");
    delete req.session.authUser;
    delete req.session.cas_user;
    res.status(401).send();
    return;
  }
  debug("cascheck is returning success!");
  res.status(200).send();
});

/**
 * A login endpoint that issues a new cookie
 * when supplied with a valid user name & password.
 */
routes.post("/login", async (req, res) => {
  if (typeof req.body !== "object") {
    res.status(400).send();
    return;
  }
  const { name, pwd } = req.body;

  // validate user name & password
  let org;
  try {
    org = await Organization.findOne({ name });
    if (!org) {
      res.redirect("/login");
      return;
    }
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
    return;
  }
  let same;
  try {
    same = await comparePassword(pwd, org.hash);
  } catch (err) {
    debug(`${err}`);
    res.status(500).send();
    return;
  }
  if (!same) {
    res.redirect("/login");
    return;
  }

  // log the user in
  const { _id } = org;
  req.session.org = _id;

  res.redirect("/");
});

/**
 * Logs a user out from their organization.
 */
routes.post("/logout", async (req, res) => {
  req.session.org = undefined;
  res.redirect("/");
});

/**
 * Checks whether the user is logged into their organization.
 */
routes.get("/check", async (req, res) => {
  const id = req.session.org;
  if (!id) {
    res.status(401).send();
    return;
  }
  const org = await Organization.findById(id);
  if (!org) {
    res.status(401).send();
    return;
  }
  res.status(200).send();
});

// TWITTER 3-LEGGED OAUTH PROCESS REFERENCING https://github.com/QuodAI/tutorial-react-twitter-api-login and https://developer.twitter.com/en/docs/authentication/guides/log-in-with-twitter
// OAuth Step 1
routes.post("/twitter/oauth/request_token", async (req, res) => {
  try {
    const { oauth_token, oauth_token_secret } =
      await oauth.getOAuthRequestToken();
    // Stores the token and secrets within the sessions (Secure because the session's data is stored on the backend)
    req.session.oauth_token = oauth_token;
    req.session.oauth_token_secret = oauth_token_secret;
    res.json({ oauth_token });
  } catch (error) {
    console.error(error);
  }
});

//OAuth Step 3 (Step 2 is on the client)
routes.post("/twitter/oauth/access_token", async (req, res) => {
  try {
    const { oauth_token: req_oauth_token, oauth_verifier } = req.body;
    const oauth_token = req.session.oauth_token;
    const oauth_token_secret = req.session.oauth_token_secret;

    if (oauth_token !== req_oauth_token) {
      res.status(403).json({ message: "Request tokens do not match" });
      return;
    }
    // Access tokens for user posting is aquired then stored in the user session
    const { oauth_access_token, oauth_access_token_secret } =
      await oauth.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
      );
    req.session.oauth_access_token = oauth_access_token;
    req.session.oauth_access_token_secret = oauth_access_token_secret;
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Missing access token" });
  }
});

routes.post("/twitter/logout", async (req, res) => {
  try {
    req.session.oauth_token_secret = undefined;
    res.json({ success: true });
  } catch (error) {
    res.status(403).json({ message: "Missing, invalid, or expired tokens" });
  }
});

module.exports = routes;
