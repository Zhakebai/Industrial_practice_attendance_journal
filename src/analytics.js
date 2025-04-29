const Attendance = require('./models/Attendance');
const User       = require('./models/User');
const Reminder   = require('./models/Reminder');
const { sendEmail } = require('./emailService');

async function runAnalytics() {
  // Rule 1: 2 absent in sequence
  const all = await Attendance.find().sort({ date: 1 });
  const byStudent = all.reduce((acc, rec) => {
    acc[rec.studentId] = acc[rec.studentId] || [];
    acc[rec.studentId].push(rec);
    return acc;
  }, {});

  for (const [sid, recs] of Object.entries(byStudent)) {
    let misses = 0, lastDate = null;
    for (const r of recs) {
      if (r.status === 'absent') {
        misses++;
        if (misses >= 2) {
          const exists = await Reminder.findOne({
            userId: sid,
            message: /2 пропуска подряд/,
            isRead: false
          });
          if (!exists) {
            const msg = `Вы пропустили 2 занятия подряд (${r.date.toISOString().split('T')[0]}). Свяжитесь с куратором.`;
            await Reminder.create({ userId: sid, message: msg });
            // send message to the couch
            await sendEmail(
              'janerke05070507@gmail.com',
              'Студент пропустил 2 пары подряд',
              `Студент ${sid} пропустил 2 пары подряд.`
            );
          }
          break;
        }
      } else {
        misses = 0;
      }
    }
  }

  // Rule 2: Reminder if there is more than 50% absents
  for (const [sid, recs] of Object.entries(byStudent)) {
    const total = recs.length;
    const absent = recs.filter(r => r.status === 'absent').length;
    if (absent / total > 0.5) {
      const exists = await Reminder.findOne({
        userId: sid,
        message: /риск пропусков/,
        isRead: false
      });
      if (!exists) {
        const msg = `У вас высокий риск пропусков (${Math.round(absent/total*100)}%). Пожалуйста, участвуйте активнее.`;
        await Reminder.create({ userId: sid, message: msg });
      }
    }
  }
}

module.exports = { runAnalytics };
