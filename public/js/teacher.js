document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/';

  const logoutBtn      = document.getElementById('logoutBtn');
  const teacherNameEl  = document.getElementById('teacherName');
  const todayDateEl    = document.getElementById('todayDate');
  const subjectSelect  = document.getElementById('subjectSelect');
  const groupSelect    = document.getElementById('groupSelect');
  const attendanceDate = document.getElementById('attendanceDate');
  const studentsSection= document.getElementById('studentsSection');
  const studentsTable  = document.getElementById('studentsTable');
  const markBtn        = document.getElementById('markBtn');
  const dateFrom       = document.getElementById('dateFrom');
  const dateTo         = document.getElementById('dateTo');
  const filterBtn      = document.getElementById('filterBtn');
  const historyTable   = document.getElementById('historyTable');

  let currentGroupId;
  let students = [];

  logoutBtn.onclick = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  (async () => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const teacherId = payload.sub;

    const profile = await fetch('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());

    teacherNameEl.textContent = profile.name;
    todayDateEl.textContent   = new Date().toLocaleDateString();
    attendanceDate.value      = new Date().toISOString().split('T')[0];

    profile.subjects.forEach(s => subjectSelect.add(new Option(s.name, s._id)));
    profile.groups.forEach(g   => groupSelect.add(new Option(g.name, g._id)));

    markBtn.onclick = async () => {
      const date      = attendanceDate.value;
      const subjectId = subjectSelect.value;
      if (!currentGroupId || !subjectId) return alert('Выберите группу и предмет');

      const rows = studentsTable.querySelectorAll('select');
      for (const sel of rows) {
        await fetch('/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            studentId: sel.dataset.userId,
            groupId:   currentGroupId,
            subjectId,
            date,
            status:    sel.value
          })
        });
      }
      alert('Отметки сохранены!');
    };

    filterBtn.onclick = async () => {
      if (!currentGroupId) return alert('Сначала выберите группу');
      let url = `/attendance?groupId=${currentGroupId}`;
      if (subjectSelect.value) url += `&subjectId=${subjectSelect.value}`;
      if (dateFrom.value)      url += `&date_from=${dateFrom.value}`;
      if (dateTo.value)        url += `&date_to=${dateTo.value}`;
    
      const records = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
    
      historyTable.innerHTML = '';
      records.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${r.studentId?.name || '—'}</td>
          <td>${new Date(r.date).toLocaleDateString()}</td>
          <td>${r.status === 'present' ? '✅' : '❌'}</td>
        `;
        historyTable.appendChild(tr);
      });
    };

  })();

  groupSelect.onchange = async () => {
    currentGroupId = groupSelect.value;
    studentsSection.classList.toggle('d-none', !currentGroupId);
    if (!currentGroupId) return;

    const users = await fetch('/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    students = users.filter(u => u.groupId === currentGroupId);

    studentsTable.innerHTML = '';
    students.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>
          <select class="form-select form-select-sm" data-user-id="${u._id}">
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
        </td>`;
      studentsTable.append(tr);
    });
  };
});