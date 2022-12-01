// OUTDATED... WILL HANDLE ON CLIENT
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  nudge_ids: { type: [mongoose.Schema.Types.ObjectId], ref: 'NudgeId' },
  labels: { type: String, enum: [] },
  order: { type: Number },
});
const assignment = mongoose.model('assignment', assignmentSchema);

module.exports = assignment;
