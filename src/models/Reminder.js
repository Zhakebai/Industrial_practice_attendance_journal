const { Schema, model } = require('mongoose');

const reminderSchema = new Schema({
  userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  date:    { type: Date,   default: () => new Date() },
  isRead:  { type: Boolean, default: false }
});

module.exports = model('Reminder', reminderSchema);
