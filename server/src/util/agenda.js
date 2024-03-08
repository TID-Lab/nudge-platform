const { Agenda } = require("@hokify/agenda");
const Participant = require("../models/participant");
const Nudge = require("../models/nudge");
const { dispatchNudges } = require("./assignments");
const mongoose = require("mongoose");

const connectionOpts = {
  db: {
    address: "mongodb://127.0.0.1/nudge-platform",
    collection: "agendaJobs",
  },
};

const agenda = new Agenda(connectionOpts);

async function scheduleNudgeHandler(job) {
  const { participantMapping, nudges, username } = job.attrs.data;
  //logic to add a nudge to history
  if (true) {
    nudges.forEach((nudge) => {
      const nudgeId = nudge.id;

      const text = nudge.text;
      const participantIds = Object.keys(participantMapping).filter(
        (key) => participantMapping[key] === text,
      );
      const extractedIds = [];

      Participant.find({ participantId: { $in: participantIds } }).then(
        (participants) => {
          participants.forEach((participant) => {
            extractedIds.push(mongoose.Types.ObjectId(participant._id));
          });
          //Nudge.collection.findOne({ _id: mongoose.Types.ObjectId(nudgeId)}).then((nudge) => {console.log(nudge)});
          Nudge.collection
            .updateOne(
              { _id: mongoose.Types.ObjectId(nudgeId) },
              { $push: { participant_history: { $each: extractedIds } } },
            )
            .then((updateResult) => {
              console.log("Update result:", updateResult);
            })
            .catch((updateError) => {
              console.error("Error updating nudge:", updateError);
            });
        },
      );
    });

    // We may want to recheck that all participants still exist. However, we do the participant accounted for check initially
    // const participants = await Participant.find({});
    const responses = await dispatchNudges(participantMapping, username);
    for (var i = 0; i < responses.length; i++) {
      var jsonData = responses[i];
      var part = jsonData.config.data;
    }
    // Some way of saving response success/failure to the job
  }
}

agenda.define("sendNudge", scheduleNudgeHandler);

agenda.start();

module.exports = agenda;
