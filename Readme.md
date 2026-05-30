Software Engineer  Task 1: Core Assessment
Objective:
Build a mini feature, Counselor Student Action Center
This feature should help a counselor quickly understand a student’s priorities, tasks, unread messages, and urgency level.

Requirements:
Build a small full-stack feature using:
Frontend: React, TypeScript, Vite
Backend: Node.js, Express, TypeScript
Mock Data :
You must use this exact mock data, read from zyra-mock-data.ts
Copy the data into your backend. Do not modify the IDs or structure.

Backend APIs:
Create the following endpoints:
GET /students/:id/action-center
PATCH /tasks/:taskId/status
Frontend Requirements:
The frontend page should include:
Student profile summary
Task list
Unread messages count
Urgency or priority badges
Ability to update task status
Loading, Error states