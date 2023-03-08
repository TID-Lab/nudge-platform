const mongoose = require('mongoose');

const nudgeSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
  },
  date_created: { type: Date, required: true },
  comment: { type: String },
  com_b: { type: [String], default: [] },
  is_active: { type: Boolean, required: true, default: true },
});

//  searchable fields
nudgeSchema.index({ message: 'text', com_b: 'text' });
const Nudge = mongoose.model('Nudge', nudgeSchema);

module.exports = Nudge;
