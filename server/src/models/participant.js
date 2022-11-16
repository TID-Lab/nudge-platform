const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true,
  },
  labels: { type: String, enum: [] },
});
const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
