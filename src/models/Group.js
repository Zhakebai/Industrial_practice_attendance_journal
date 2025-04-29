const { Schema, model } = require('mongoose');

const groupSchema = new Schema({
  name:     { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }] 
});

module.exports = model('Group', groupSchema);
