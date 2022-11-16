const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true,
  },
  // TEMPORARY/TO CHANGE - Currently just using 3 demographic distinctions (age, race/ethnicity, gender) for testing
  labels: { type: [String], enum: ['18-29', '30-41', '42-53', '54-65', 'black', 'latinx', 'white', 'asian', 'female', 'male'] },
});
const Participant = mongoose.model('Participant', participantSchema);
module.exports = Participant;
