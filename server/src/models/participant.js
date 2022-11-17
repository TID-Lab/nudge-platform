const mongoose = require('mongoose');
const { demographic_enum } = require('../util/assignments')

// not sure why demographic enum is not importing...
const labels = {
  Age: ['18-29', '30-41', '42-53', '54-65'],
  Race: ['black', 'latinx', 'white', 'asian'],
  Gender: ['female', 'male'],
};
const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true,
  },
  // This method just unrolls the labels object
  labels: { type: [String], enum: Object.values(labels).flat(1) },
});
const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
