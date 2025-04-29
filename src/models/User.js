const { Schema, model } = require('mongoose');
const userSchema = new Schema({
  name:         { type: String,  required: true },
  email:        { type: String,  required: true, unique: true },
  passwordHash: { type: String,  required: true },
  role:         { type: String,  enum: ['student','teacher'], default: 'student' },
  groupId:      { type: Schema.Types.ObjectId, ref: 'Group' },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
  groups:   [{ type: Schema.Types.ObjectId, ref: 'Group' }]
});

module.exports = model('User', userSchema);
