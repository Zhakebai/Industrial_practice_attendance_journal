const express       = require('express');
const { authenticate, permit } = require('../middleware/auth');
const { runAnalytics }          = require('../analytics');
const router        = express.Router();

router.post('/run', authenticate, permit('teacher'), async (req, res) => {
  await runAnalytics();
  res.json({ status: 'analytics run' });
});

module.exports = router;
