# CampusGrid Frontend — Academic Administration & Faculty Single Page Application

Modern, high-performance Single Page Application (SPA) for **CampusGrid**, serving administrators, deans, and faculty members with dedicated portals, real-time schedule feeds, and interactive timetable management for the Computer Science Department.

---

## 1. Technology Stack & Architecture

- **Framework:** React 18 (Functional components with Hooks)
- **Routing:** React Router DOM 6.x with nested protected routes
- **Build Tool:** Vite 6.x
- **Icons:** Lucide React
- **Design System:** Custom CSS design system tokens (Vibrant Purple Palette, Dark/Light theme toggle, responsive layout)
- **API Client:** Native `fetch` with AbortController timeout, centralized error normalizer, and request correlation IDs

---

## 2. Portals & Role-Based Views

1. **Administrator Portal (`/admin/*`):**
   - Live department dashboard metrics & quick statistics
   - Faculty management with automated `@campusgrid.com` account creation
   - Master data CRUD: Semesters, Class Sections, Subjects, Classrooms, Labs, Auditoriums, and Period Schedules
   - Dynamic interactive timetable scheduler with conflict warning alerts
   - Bulk timetable selection & batch deletion toolbar

2. **Dean Oversight Portal (`/dean/*`):**
   - Executive dashboard with live lecture counters, faculty load, and substitution tracking
   - Real-time departmental timetable schedule status
   - Free room finder (Classrooms, Labs, Auditoriums) across all scheduled periods
   - Faculty and class section search drawers

3. **Faculty Portal (`/faculty/*`):**
   - Personal schedule dashboard and today's upcoming lectures
   - Weekly timetable matrix view
   - Class substitution request modal and coverage coordination

4. **Authentication:**
   - Multi-role secure login portal (`/login`)
   - Initial root administrator bootstrap signup (`/signup`)
   - Dedicated Dean executive access (`/dean/login`)

---

## 3. Prerequisites

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Backend API:** CampusGrid Backend running on `http://localhost:5000` (or configured via environment)

---

## 4. Installation & Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for local development):
   ```bash
   cp .env.example .env
   ```

---

## 5. Environment Variables

Configure in `frontend/.env`:

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | Empty (relative `/api/v1` proxy) | Remote backend API origin (e.g., `https://api.campusgrid.edu` for split deployments) |

---

## 6. Development & Build Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite local development server on `http://localhost:5173` |
| `npm run build` | Compiles production assets into `dist/` |
| `npm run preview` | Previews production build locally |

---

## 7. Backend Integration

The frontend integrates with the CampusGrid Express backend:
- Default development proxy routes `/api/v1` to `http://localhost:5000/api/v1`.
- Authentication tokens are stored in `localStorage` under `campus_grid_token`.
- Theme preferences (`light` / `dark`) persist under `campus_grid_theme`.
- Automatic session invalidation triggers on `401 Unauthorized` responses via custom browser events.
