const mongoose = require("mongoose");
const { DEMO_ENUM } = require("../util/constants");

// not sure why demographic enum is not importing...
const labels = Object.fromEntries(
  Object.entries(DEMO_ENUM).map(([k, v]) => {
    return [k, Array.isArray(v) ? v : Object.values(v)];
  }),
);

const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true,
  },
  // This method just unrolls the labels object
  labels: { type: [String], enum: Object.values(labels).flat(1) },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
});
const Participant = mongoose.model("Participant", participantSchema);
module.exports = Participant;
