document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/';

  // Elements
  const logoutBtn      = document.getElementById('logoutBtn');
  const studentNameEl  = document.getElementById('studentName');
  const studentGroupEl = document.getElementById('studentGroup');
  const todayDateEl    = document.getElementById('todayDate');
  const subjectSelect  = document.getElementById('subjectSelect');
  const subjectTeacher = document.getElementById('subjectTeacher');
  const remindersList  = document.getElementById('remindersList');
  const attendanceTable= document.getElementById('attendanceTable');

  logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Fetch profile
  const p = await fetch('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.json());

  // Info About Student
  studentNameEl.textContent  = p.name;
  studentGroupEl.textContent = p.group?.name || '—';
  todayDateEl.textContent    = new Date().toLocaleDateString();

  // Reminders
  if (p.reminders?.length) {
    p.reminders.forEach(r => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${new Date(r.date).toLocaleDateString()}: ${r.message}`;
      remindersList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.className = 'list-group-item text-muted';
    li.textContent = 'У вас нет уведомлений.';
    remindersList.appendChild(li);
  }

  // Populate subjects with data-teacher-name
  p.subjects.forEach(s => {
    const opt = document.createElement('option');
    opt.value             = s._id;
    opt.textContent       = s.name;
    opt.dataset.teacher   = s.teacherName;  
    subjectSelect.append(opt);
  });

  // Load attendance
  async function loadAttendance() {
    const sel = subjectSelect.selectedOptions[0];
    subjectTeacher.textContent = sel?.dataset.teacher || '—';

    let url = `/attendance?studentId=${p.id}`;
    if (subjectSelect.value) url += `&subjectId=${subjectSelect.value}`;

    const records = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    attendanceTable.innerHTML = '';
    records.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${new Date(r.date).toLocaleDateString()}</td>
        <td>${r.status === 'present' ? '✅ Присутствовал' : '❌ Отсутствовал'}</td>
      `;
      attendanceTable.append(tr);
    });
  }
  subjectSelect.onchange = loadAttendance;
  loadAttendance();
});
