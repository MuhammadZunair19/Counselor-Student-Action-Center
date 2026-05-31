# Counselor Student Action Center

A full-stack mini feature that helps counselors quickly understand a student's priorities, tasks, unread messages, and urgency level.

**Stack:** React + TypeScript + Vite (frontend) · Node.js + Express + TypeScript (backend)

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (included with Node.js)

---

## Setup & Run

Clone the repository, then start the **backend** and **frontend** in separate terminals.

### 1. Backend (API server)

```bash
cd backend
npm install
npm run dev
```

The API runs at **http://localhost:3001**.

Production build (optional):

```bash
npm run build
npm start
```

### 2. Frontend (UI)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

The Vite dev server proxies `/api/*` to the backend on port 3001, so both servers must be running for local development.

### Mock students

Use the student dropdown in the UI, or call the API directly:

| ID        | Name           |
|-----------|----------------|
| `stu_001` | Maya Patel     |
| `stu_002` | Jordan Lee     |
| `stu_003` | Carlos Rivera  |

Mock data lives in `backend/src/data/mock-data.ts` (copied from `zyra-mock-data.ts` at the repo root).

---

## API Contract

Base URL (local): `http://localhost:3001`

### `GET /students/:id/action-center`

Returns everything needed for the counselor action center view.

**Path parameters**

| Name | Type   | Description        |
|------|--------|--------------------|
| `id` | string | Student ID (e.g. `stu_001`) |

**Success — `200 OK`**

```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "tasks": [
    {
      "id": "tsk_001",
      "studentId": "stu_001",
      "title": "Submit FAFSA application",
      "description": "Deadline is approaching. Student has not started the form.",
      "status": "todo",
      "priority": "urgent",
      "dueDate": "2026-06-05",
      "createdAt": "2026-05-13T14:00:00Z",
      "updatedAt": "2026-05-13T14:00:00Z"
    }
  ],
  "unreadMessageCount": 2,
  "urgencyLevel": "critical"
}
```

| Field                | Type     | Description |
|----------------------|----------|-------------|
| `student`            | object   | Student profile |
| `tasks`              | array    | All tasks for this student |
| `unreadMessageCount` | number   | Count of messages where `read === false` |
| `urgencyLevel`       | string   | One of: `critical`, `high`, `medium`, `low` |

**Response headers**

| Header | Description |
|--------|-------------|
| `X-Request-Id` | Unique ID per request (echoed from client header if provided) |

**Errors**

| Status | Body | When |
|--------|------|------|
| `404`  | `{ "error": "Student not found", "requestId": "..." }` | Unknown student ID |

---

### `PATCH /tasks/:taskId/status`

Updates a task's status. Changes persist in memory until the server restarts.

**Path parameters**

| Name     | Type   | Description |
|----------|--------|-------------|
| `taskId` | string | Task ID (e.g. `tsk_001`) |

**Request body**

```json
{
  "status": "in_progress"
}
```

| Field    | Type   | Allowed values |
|----------|--------|----------------|
| `status` | string | `todo`, `in_progress`, `completed` |

**Success — `200 OK`**

Returns the updated task object (same shape as items in `tasks` above), with `updatedAt` set to the server time.

**Errors**

| Status | Body | When |
|--------|------|------|
| `400`  | `{ "error": "Invalid status...", "requestId": "..." }` | Missing or invalid `status` |
| `404`  | `{ "error": "Task not found", "requestId": "..." }` | Unknown task ID |
| `500`  | `{ "error": "Internal server error", "requestId": "..." }` | Unhandled server error |

---

### `GET /health` (optional)

**Success — `200 OK`**

```json
{ "status": "ok" }
```

---

## Architecture

### High-level layout

```
Task 1/
├── backend/          # Express API + in-memory data
├── frontend/         # React SPA (Vite)
└── zyra-mock-data.ts # Original mock data reference
```

### Backend

The backend follows a simple layered structure:

```
src/
├── app.ts                # Express app factory (used by server + tests)
├── index.ts              # Server entrypoint
├── store.ts              # In-memory copies of mock data (tasks are mutable)
├── data/mock-data.ts     # Exact mock dataset (students, tasks, messages)
├── middleware/           # requestId, requestLogger, errorHandler
├── routes/               # HTTP handlers (thin)
│   ├── students.ts       # GET /students/:id/action-center
│   └── tasks.ts          # PATCH /tasks/:taskId/status
├── services/             # Business logic
│   ├── action-center.ts  # Aggregates student, tasks, unread count, urgency
│   ├── tasks.ts          # Task status validation and updates
│   └── urgency.ts        # Derives urgencyLevel from enrollment + open tasks
└── types/                # Shared TypeScript interfaces
```

**Data flow:** Routes validate input and call services. Services read/write `store.ts`. The action-center service joins student, filtered tasks, and message data, then computes `urgencyLevel` from enrollment status, open urgent tasks, overdue tasks, and priority weights.

### Frontend

```
src/
├── api/client.ts         # fetch wrappers for both endpoints
├── hooks/
│   └── useActionCenter.ts  # Loading, error, fetch, and status-update state
├── components/           # Presentational UI
│   ├── ActionCenter.tsx  # Page shell + student selector
│   ├── StudentProfile.tsx
│   ├── TaskList.tsx / TaskItem.tsx
│   ├── Badge.tsx
│   ├── LoadingState.tsx
│   └── ErrorState.tsx
└── types/                # Mirrors backend response shapes
```

**Data flow:** `ActionCenter` holds the selected student ID. `useActionCenter` loads data from `GET /students/:id/action-center`. Task status changes call `PATCH /tasks/:taskId/status`, then refetch the action center so urgency and counts stay in sync. Vite proxies `/api` → `http://localhost:3001` during development.

### Urgency calculation (backend)

`urgencyLevel` is derived server-side so the frontend displays a single source of truth:

- **critical** — at-risk student with urgent open tasks, 2+ urgent open tasks, or 2+ overdue open tasks
- **high** — any urgent/overdue open task, or high combined priority score among open tasks
- **medium** — any remaining open tasks
- **low** — no open tasks

---

## Assessment mapping

| Requirement | Implementation |
|-------------|----------------|
| Student profile summary | `StudentProfile` component |
| Task list | `TaskList` / `TaskItem` |
| Unread messages count | From API, shown in profile |
| Urgency / priority badges | Overall urgency + per-task priority + enrollment |
| Update task status | Status dropdown per task |
| Loading / error states | `LoadingState`, `ErrorState`, update error banner |

---

## Task 2: Production readiness (branch `task-2-production-readiness`)

This branch adds observability, structured errors, automated tests, and CI.

### What was added

| Area | Change |
|------|--------|
| Request logging | JSON logs per request: `requestId`, method, path, status, `durationMs` |
| Error middleware | Central handler; all errors include `requestId`; `X-Request-Id` on every response |
| Backend tests | Integration tests (`supertest` + Vitest) in `backend/tests/integration/` |
| Frontend tests | Component test for `StudentProfile` (Vitest + Testing Library) |
| CI | GitHub Actions workflow runs backend + frontend tests on push |

### Running tests

```bash
# Backend
cd backend && npm install && npm test

# Frontend
cd frontend && npm install && npm test
```

### CI / test output

- **CI workflow:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — runs on push to `master` and `task-2-production-readiness`
- **Sample local test log:** [`docs/ci-test-output.md`](docs/ci-test-output.md) (paste of `npm test` in both packages)
- After pushing, open the **Actions** tab on GitHub for the run log (satisfies “screenshot or CI run log”)

### Performance decisions & tradeoffs

| Decision | Rationale | Tradeoff |
|----------|-----------|----------|
| **In-memory store** | Fast reads/writes for demo scale; no DB setup | Data resets on restart; not horizontally scalable |
| **Single refetch after task PATCH** | Keeps `urgencyLevel` and counts correct from server | Extra round-trip vs optimistic UI only |
| **Server-side urgency** | One source of truth; frontend stays thin | Slightly more backend CPU per action-center request |
| **JSON request logging** | Easy to grep/ship to log aggregators later | Console-only for now (no log rotation / levels config) |
| **`resetStores()` in tests** | Deterministic integration tests without a test DB | Tests must not run in parallel against shared state (`fileParallelism: false`) |
| **No pagination on tasks** | Mock data has few tasks per student | Would need paging if lists grow in production |
| **Vite dev proxy** | Simple local DX | Production needs explicit API URL or reverse proxy |

**If scaling further:** add a real database, cache action-center responses (short TTL), structured logger (pino), rate limiting, and optimistic updates with background revalidation on the frontend.

---

## License

Assessment submission — see repository owner for usage terms.
