const express = require('express');
const Group   = require('../models/Group');
const router  = express.Router();

router.post('/', async (req, res) => {
  try {
    const group = new Group({ name: req.body.name });
    await group.save();
    res.status(201).json(group);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const list = await Group.find();
  res.json(list);
});

module.exports = router;
