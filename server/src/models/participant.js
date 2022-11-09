const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  labels: { type: String, enum: [] },
});
const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
