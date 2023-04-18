const { Agenda } = require('@hokify/agenda');
const Participant = require('../models/participant');
const { dispatchNudges } = require('./assignments');

const connectionOpts = { db: { address: 'mongodb://127.0.0.1/nudge-platform', collection: 'agendaJobs' } };

const agenda = new Agenda(connectionOpts);

async function scheduleNudgeHandler(job) {
  console.log(job.attrs)
  const { participantMapping, nudges, username } = job.attrs.data;
  // We may want to recheck that all participants still exist. However, we do the participant accounted for check initially
  // const participants = await Participant.find({});
  console.log("sending nudges!")
  console.log(participantMapping)
  const responses = await dispatchNudges(participantMapping, username);
  console.log("all responses:")
  for (const res in responses) {
    console.log(res);
  }
  // Some way of saving response success/failure to the job
}

agenda.define('sendNudge', scheduleNudgeHandler)

agenda.start()

module.exports = agenda;
