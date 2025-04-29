const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const Group    = require('../models/Group');
const Subject = require('../models/Subject');
const Reminder = require('../models/Reminder');    
const { authenticate } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, groupId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role, groupId });
    await user.save();

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'invalid credentials' });

    const token = jwt.sign(
      { sub: user._id, role: user.role, name: user.name, groupId: user.groupId },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


router.get('/profile', authenticate, async (req, res) => {
  const user = await User.findById(req.user.sub)
    .populate('subjects','name')
    .populate('groups','name');

  if (user.role === 'teacher') {
    return res.json({
      id:       user._id,
      name:     user.name,
      subjects: user.subjects,
      groups:   user.groups
    });
  }
  
  // For student
  const group = await Group.findById(user.groupId).populate('subjects','name');
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  const subjectsWithTeachers = await Promise.all(
    group.subjects.map(async sub => {
      const t = await User.findOne({
        role:     'teacher',
        subjects: sub._id,
        groups:   user.groupId
      });
      return {
        _id:         sub._id,
        name:        sub.name,
        teacherName: t ? t.name : '—'
      };
    })
  );

  res.json({
    id:       user._id,
    name:     user.name,
    group:    { id: group._id, name: group.name },
    subjects: subjectsWithTeachers
  });
});


module.exports = router;