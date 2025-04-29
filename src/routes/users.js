const express = require('express');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const router  = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, groupId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role, groupId });
    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const list = await User.find().select('name email role groupId');
  res.json(list);
});

module.exports = router;
