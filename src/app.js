require('dotenv').config();
const express = require('express');
require('./db');
const path    = require('path');
const { authenticate, permit } = require('./middleware/auth');

const authRoute   = require('./routes/auth');
const usersRoute  = require('./routes/users');
const groupsRoute = require('./routes/groups');
const attendRoute = require('./routes/attendance');
const subjectsRoute = require('./routes/subjects');

const cron          = require('node-cron');
const analyticsRoute = require('./routes/analytics');
const { runAnalytics } = require('./analytics');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth', authRoute);

app.use('/subjects', subjectsRoute);

app.use(authenticate);

app.use('/groups', permit('teacher'), groupsRoute);
app.use('/users',  permit('teacher'), usersRoute);

app.use('/attendance', attendRoute);

app.use('/analytics', analyticsRoute);

cron.schedule('0 8 * * *', () => {
  runAnalytics().catch(console.error);
});

app.get('/', (_, res) => res.send('API работает на MongoDB!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
