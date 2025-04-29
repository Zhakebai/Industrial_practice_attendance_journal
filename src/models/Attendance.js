const { Schema, model } = require('mongoose');

const attendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  groupId:   { type: Schema.Types.ObjectId, ref: 'Group',   required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User',    required: true },
  date:      { type: Date,   required: true },
  status:    { type: String, enum: ['present','absent'], required: true }
}, { timestamps: true });

module.exports = model('Attendance', attendanceSchema);
