const { Schema, model } = require('mongoose');

const subjectSchema = new Schema({
  name:   { type: String, required: true, unique: true },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }]
});

module.exports = model('Subject', subjectSchema);
