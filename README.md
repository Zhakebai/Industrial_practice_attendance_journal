# Industrial_practice_attendance_journal
# Attendance Journal Web Application

A full-stack web application for managing student attendance with preventive analytics and notifications.

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Description
This project provides a web interface allowing teachers to mark student attendance per subject and date, and students to view their attendance history with notifications and subject-specific teachers.

## Features
- Teacher and student authentication (JWT)
- Role-based access control
- CRUD for groups, subjects, and users
- Attendance marking by subject and date
- Attendance history filtering
- Preventive analytics (risk detection) and notifications

## Technologies
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript, Bootstrap
- **Authentication:** JWT
- **Linting & Formatting:** ESLint, Prettier

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/attendance-journal.git
   cd attendance-journal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in the variables.
4. Seed the database:
   ```bash
   node src/seedSubjects.js
   node src/assignGroupSubjects.js
   node src/assignTeacherGroups.js
   node src/seedStudents.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Usage
- Visit `http://localhost:3000` in your browser.
- Register or login as a teacher or student.
- Teachers can select subject, group, date, and mark attendance.
- Students can view their attendance filtered by subject and see their assigned teacher.

## API Endpoints
| Endpoint             | Method | Auth         | Description                       |
|----------------------|--------|--------------|-----------------------------------|
| `/auth/register`     | POST   | No           | Register a new user              |
| `/auth/login`        | POST   | No           | Login and receive JWT            |
| `/auth/profile`      | GET    | Bearer token | Get authenticated user profile   |
| `/groups`            | GET    | Teacher      | List groups                      |
| `/groups`            | POST   | Teacher      | Create a new group               |
| `/subjects`          | GET    | Auth         | List all subjects                |
| `/subjects`          | POST   | Teacher      | Create a new subject             |
| `/attendance`        | GET    | Auth         | Get attendance records           |
| `/attendance`        | POST   | Teacher      | Mark attendance                  |

## Screenshots
<!-- Add screenshots in the `screenshots/` directory -->
1. **Teacher Dashboard**
   ![Teacher Dashboard](screenshots/teacher_dashboard.png)
2. **Mark Attendance**
   ![Mark Attendance](screenshots/mark_attendance.png)
3. **Student View**
   ![Student View](screenshots/student_view.png)
4. **Attendance History**
   ![Attendance History](screenshots/attendance_history.png)

## Contributing
Contributions are welcome! Please open issues or submit pull requests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

