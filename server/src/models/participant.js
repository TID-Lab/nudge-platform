const mongoose = require('mongoose');
const { demographic_enum } = require('../util/assignments')

// not sure why demographic enum is not importing...
const labels = {
  Age: ['18-29', '30-40', '41-50', '51-64', '65+'],
  Race: ['black', 'latinx', 'white', 'asian', 'native-american'],
  Gender: ['female', 'male', 'non-binary'],
  Diabetes: ['has-diabetes', 'at-risk', 'caretaker'],
  TestingStatus: ['tested', 'untested']
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
