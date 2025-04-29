const express = require('express');
const { authenticate, permit } = require('../middleware/auth');
const Subject = require('../models/Subject');
const router  = express.Router();

router.get('/', authenticate, async (req, res) => {
  const list = await Subject.find();
  res.json(list);
});

router.post('/', authenticate, permit('teacher'), async (req, res) => {
  try {
    const { name } = req.body;
    const subj = new Subject({ name });
    await subj.save();
    res.status(201).json(subj);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;