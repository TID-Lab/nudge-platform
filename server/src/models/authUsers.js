const mongoose = require('mongoose');

/**
 * The Mongoose Schema for a partner organization using the dashboard.
 */
const authUsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'basic'],
    default: 'basic',
  },
}, { versionKey: false });

const AuthUsers = mongoose.model('AuthUsers', authUsersSchema);

module.exports = AuthUsers;
