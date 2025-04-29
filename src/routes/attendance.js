const express    = require('express');
const Attendance = require('../models/Attendance');
const { authenticate, permit } = require('../middleware/auth');
const router     = express.Router();


router.get('/', authenticate, async (req, res) => {
  const { studentId, groupId, subjectId, date_from, date_to } = req.query;
  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (groupId)   filter.groupId   = groupId;
  if (subjectId) filter.subjectId = subjectId;
  if (date_from || date_to) {
    filter.date = {};
    if (date_from) filter.date.$gte = new Date(date_from);
    if (date_to)   filter.date.$lte = new Date(date_to);
  }
  const records = await Attendance.find(filter)
    .populate('studentId','name')
    .populate('subjectId','name')
    .populate('teacherId','name')
    .sort({ date: -1 });
  res.json(records);
});

// POST /attendance — only teacher
router.post('/', authenticate, permit('teacher'), async (req, res) => {
  const { studentId, groupId, subjectId, date, status } = req.body;
  
  const group = await Group.findById(groupId);
  if (!group.subjects.includes(subjectId)) {
    return res.status(400).json({ error: 'Subject not taught in this group' });
  }

  const teacherId = req.user.sub;
  const rec = new Attendance({ studentId, groupId, subjectId, teacherId, date, status });
  await rec.save();
  res.status(201).json(rec);
});


module.exports = router;
