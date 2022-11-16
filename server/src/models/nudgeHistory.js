const mongoose = require('mongoose');

const nudgeHistorySchema = new mongoose.Schema({
  nudge_ids: { type: [mongoose.Schema.Types.ObjectId], ref: 'Nudge' },
  labels: { type: String, enum: [] },
  order: { type: Number },
  date_sent: { type: Date, required: true },
  participant_ids: { type: [mongoose.Schema.Types.ObjectId], ref: 'ParticipantId' },
});
const nudgeHistory = mongoose.model('nudgeHistory', nudgeHistorySchema);

module.exports = nudgeHistory;
