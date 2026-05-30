# CI / Test output sample

Captured from local runs on branch `task-2-production-readiness` (same commands as GitHub Actions).

## Commands

```bash
cd backend && npm ci && npm run build && npm test
cd frontend && npm ci && npm test && npm run build
```

---

## Backend (`npm test`)

```
 RUN  v3.2.4

stdout | tests/integration/api.test.ts > ... > returns action center payload for a valid student with request ID
{"level":"info","requestId":"...","method":"GET","path":"/students/stu_001/action-center","status":200,"durationMs":7}

 ✓ tests/integration/api.test.ts (5 tests)

 Test Files  1 passed (1)
      Tests  5 passed (5)
```

**Coverage:**

- `GET /students/:id/action-center` — 200 + payload shape
- `PATCH /tasks/:taskId/status` — update + reflected on refetch
- 404 / 400 error bodies include `requestId`
- `X-Request-Id` propagation from client

---

## Frontend (`npm test`)

```
 RUN  v3.2.4

 ✓ src/components/StudentProfile.test.tsx (2 tests)

 Test Files  1 passed (1)
      Tests  2 passed (2)
```

**Coverage:**

- Renders student name, email, GPA, grade
- Urgency and enrollment badges
- Unread message count highlight when > 0

---

## GitHub Actions

After pushing this branch, open:

`https://github.com/MuhammadZunair19/Counselor-Student-Action-Center/actions`

The **CI** workflow should show a green run with both test steps passing.
