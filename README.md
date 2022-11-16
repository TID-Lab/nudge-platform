# COVID-19 Testing Nudge Platform


The platform is actively developed by the [Technology & International Development Lab](http://tid.gatech.edu) at Georgia Tech in collaboration with Emory University & the Morehouse School of Medicine. (?)

## Architecture Overview



This platform is a [Node.js](https://nodejs.org) application with a [MongoDB](https://mongodb.com) database.


`server` is an [Express](https://expressjs.com/) app that hosts both a client-side [React](https://reactjs.org/) application in production and a server-side RESTful web API that queries the database based on user input.

The platform...
- interfaces with the database through the [Mongoose](https://mongoosejs.com/) model layer.
- is managed in production using [PM2](https://pm2.keymetrics.io/).
- pull secrets & API keys from a shared [.env](https://www.npmjs.com/package/dotenv) file located at the project root folder.

### Folder Structure

- `server/` - Contains the source code for the `server` application.
- `client/`
  - In *development*, this folder contains the source code for a self-hosted version of the client-side React application that comes with a bunch of goodies that you'll want to use (like hot module reloading). All client-side requests are proxied to the RESTful web API hosted by the server.
  - In *production*, this folder contains a `build/` folder that stores a bundled & optimized version of the React app which is served up as static files by the `server`.
- `assets/` - Contains image files for this README :-)

## Development Environment

### Installation

1. Clone this repository on your local machine.

2. Download the [MongoDB Community](https://mongodb.com) server to your computer.

3. Install [nvm](https://github.com/nvm-sh/nvm). We'll use this to install Node.js properly in the next step.

4. Open a terminal and `cd` to your clone of this repository. From there, run `nvm install` to install the right version of Node.js onto your machine.

5. Run `npm install` in  the `server/` and `client/` folders to install their respective dependencies.

6. You're done! I'm proud of you. 😁👍

### Setup

Create an empty `.env` file in the root folder for this repo and add the following environment variables using the [dotenv](https://www.npmjs.com/package/dotenv) format:

- `SESSION_SECRET` - An alphanumeric secret string used to secure user sessions; should be random.
- `STORE_SECRET` - An alphanumeric secret string used to encrypt user session information in the database; should be random.
- `CALLBACK_URL` - The callback URL used for Oauth. This is only needed for local testing. If not specified, our live website's URL is given.

To populate the database with sample data found in `server\src\sampleData.js`, simply start the MongoDB server and run `node populateDB.js` within `server\src`.
### Running

Running the dashboard in development requires starting up two separate Node.js applications.

Open up 2 terminal windows or tabs, and then execute the commands below in the order they are listed, one to each terminal. In each case, make sure to `cd` into the corresponding folder first.

1. Run the `server` app with `npm run dev`\*
2. Run the `client` app with `npm start`

\* A default admin user with the name `Georgia Tech` and password `letmein1` will be created when you run the `server` app for the first time.

## Maintenance

To do any maintenance on the production deployment of the dashboard, SSH into the virtual machine where the production dashboard is being hosted first.

### PM2 Command Glossary

This project uses [PM2](https://pm2.keymetrics.io/) to manage its Node.js applications in production. Below is a handy glossary of important PM2 commands that you'll want in your maintenance tool belt.

<html>
  <table>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
    <tr>
      <td><code>pm2 start &lt;process&gt;</code></td>
      <td>Starts a process.</td>
    </tr>
    <tr>
      <td><code>pm2 stop &lt;process&gt;</code></td>
      <td>Stops a process.</td>
    </tr>
    <tr>
      <td><code>pm2 restart &lt;process&gt;</code></td>
      <td>Stops <i>and</i> starts a process.</td>
    </tr>
    <tr>
      <td><code>pm2 status</code></td>
      <td>Reports the status (e.g. active, stopped, erroring) of all processes.</td>
    </tr>
    <tr>
      <td><code>pm2 logs &lt;process&gt;</code></td>
      <td>Prints out the recent logs from a process.</td>
    </tr>
  </table>
</html>

For all commands above, your options for `<process>` are:
- `fetch`
- `server`

These processes are the two Node.js applications described above at the top of the [Architecture Overview](#architecture-overview) section.

### Upgrading the dashboard

You've made changes to the source code, and now you want to apply those changes to the deployed dashboard. Depending on where you made your changes, you'll need to run different commands.

First, make sure that you've pushed those changes to this GitHub repo, and then pulled them down on the production VM with `git pull`.

**If you made changes...**

- in the `client/` folder, **do nothing**. There should be a git hook on the production VM that automatically builds the client-side React application for you with the new code. If you're paranoid, just run `npm run build` from the `client/` folder to manually build the React app. (NOTE: haven't had luck with the git hook, so run this to be safe.)

- in the `server/` folder, run `pm2 restart server`.

And that's it. You've upgraded the dashboard! Woo woo 🎉


**In some cases, one way to avoid this problem is to just play with existing data.** You'll have to get creative with simulating the production environment, but your development cycle will be much faster as a result!


## License

This project is licensed under the [GNU GPLv3](./LICENSE) license.






