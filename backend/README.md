# CampusGrid Backend — Academic Administration & Resource Scheduling API

Backend API service for **CampusGrid**, an academic timetable and resource synchronization platform engineered for the Computer Science Department. Built with Node.js, Express, MongoDB, and Mongoose, providing role-based security, multi-portal APIs (Admin, Dean, Faculty), Server-Sent Events (SSE) synchronization, and collision-free timetable scheduling.

---

## 1. Technology Stack

- **Runtime:** Node.js (>= 18.x)
- **Web Framework:** Express.js 4.x
- **Database:** MongoDB (Local or MongoDB Atlas) via Mongoose 8.x
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` password hashing
- **Validation:** `express-validator`
- **Mail Service:** Nodemailer (SMTP / Ethereal Dev fallback)
- **Testing:** Node.js native test runner (`node:test`) and Supertest

---

## 2. Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas connection URI

---

## 3. Installation & Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

---

## 4. Environment Variables

Configure in `backend/.env` (or root `.env`):

| Variable | Required | Default / Example | Purpose |
|---|---|---|---|
| `PORT` | No | `5000` | HTTP port for the Express API server |
| `NODE_ENV` | No | `development` | Environment mode (`development`, `production`, `test`) |
| `MONGODB_URI` | **Yes** | `mongodb://127.0.0.1:27017/campus_grid` | MongoDB connection URI |
| `DB_NAME` | No | `campus_grid` | Target database collection namespace |
| `JWT_SECRET` | **Yes** | Strong 32+ char key | Secret key for signing JSON Web Tokens |
| `JWT_EXPIRES_IN` | No | `7d` | Expiration window for issued tokens |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend origin for CORS policy |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated allowed CORS origins |
| `MAIL_HOST` | No | `smtp.example.com` | SMTP host for faculty credential emails |
| `MAIL_PORT` | No | `587` | SMTP port |
| `MAIL_USER` | No | `smtp_username` | SMTP username |
| `MAIL_PASSWORD`| No | `smtp_password` | SMTP password |
| `MAIL_FROM` | No | `"CampusGrid Administration <admin@campusgrid.edu>"` | Outgoing sender display |

> **Development Mode Mailer:** When `MAIL_HOST` is unconfigured or points to Ethereal, credentials are logged safely to the console.

---

## 5. Development & Production Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts server with `nodemon` live-reload on port 5000 |
| `npm start` | Starts production server with `node src/server.js` |
| `npm test` | Runs the automated 7-suite integration test harness |
| `npm run migrate:atlas` | Non-destructive local MongoDB to Atlas sync utility |

---

## 6. Database Verification & Seeding

On server startup in development (`NODE_ENV=development`), `backend/src/utils/seedFacultyData.js` automatically initializes:
- Root Administrator: `admin@campusgrid.com` / `AdminPassword2026!`
- Dean of Department: `dean@campusgrid.com` / `Password123`
- Faculty accounts: `subu@campusgrid.com`, `john@campusgrid.com`, `ravi@campusgrid.com`, `kumar@campusgrid.com`, `alan@campusgrid.com` (Default temporary password: `password@123`)
- Master data: Semesters, Sections, Classrooms, Labs, Auditoriums, and Period schedules

---

## 7. REST API Endpoints Overview

Base URL: `http://localhost:5000/api/v1`

### System & Health
- `GET /health` — Service health check & database connection status

### Authentication (`/auth`)
- `GET /auth/status` — Checks if root administrator exists
- `POST /auth/signup` — Initial administrator signup (locked once initialized)
- `POST /auth/login` — Authenticates Admin, Dean, or Faculty; returns JWT
- `GET /auth/me` — Returns current authenticated user profile

### Administrative Operations (`/admin`) *(Bearer Token: Admin)*
- `GET /admin/dashboard` — Comprehensive department analytics & live metrics
- `GET /admin/semesters`, `POST /admin/semesters` — Semester management
- `GET /admin/sections`, `POST /admin/sections` — Class section management
- `GET /admin/subjects`, `POST /admin/subjects` — Subject allocation
- `GET /admin/classrooms`, `POST /admin/classrooms` — Classroom management
- `GET /admin/labs`, `POST /admin/labs` — Lab facilities
- `GET /admin/auditoriums`, `POST /admin/auditoriums` — Auditorium resources
- `GET /admin/periods`, `POST /admin/periods` — Schedule periods (12-hour AM/PM format)
- `GET /admin/faculty`, `POST /admin/faculty` — Faculty directory with automated `@campusgrid.com` provisioning
- `POST /admin/faculty/:id/resend-credentials` — Dispatches login credentials to personal email
- `GET /admin/timetable`, `POST /admin/timetable` — Master timetable with tri-conflict prevention
- `POST /admin/timetable/bulk-delete` — Batch deletion of scheduled periods

### Dean Executive Oversight (`/dean`) *(Bearer Token: Dean)*
- `GET /dean/dashboard` — Dean real-time operations, substitutions, and capacity metrics
- `GET /dean/classes/search` — Search sections, subjects, and timetables
- `GET /dean/rooms/search` — Room utilization and occupancy
- `GET /dean/rooms/free` — Query available classrooms, labs, and auditoriums by period
- `GET /dean/faculty/search` — Faculty search, load tracking, and schedules
- `GET /dean/current-status` — Real-time live period timetable matrix
- `GET /dean/substitutions` — Department-wide substitution oversight

### Faculty Portal (`/faculty`) *(Bearer Token: Faculty)*
- `GET /faculty/dashboard` — Faculty schedule, upcoming lectures, substitution notifications
- `GET /faculty/timetable/weekly` — Personal weekly class schedule
- `GET /faculty/available-substitutes` — Query available faculty for class coverage
- `POST /faculty/substitution` — Request lecture substitution coverage

---

## 8. Automated Testing

Run the full integration test suite:
```bash
npm test
```
The test harness validates:
1. Health check & authentication status
2. Master data CRUD (Semesters, Sections, Subjects, Rooms, Labs, Periods)
3. Faculty provisioning and `@campusgrid.com` collision handling
4. Tri-conflict timetable scheduling (Faculty, Room, and Section collisions)
5. Dean executive oversight & room availability filters
6. Faculty substitution workflows & role boundary security
7. Robust error handling & HTTP 400/401/403/404/409 validation
