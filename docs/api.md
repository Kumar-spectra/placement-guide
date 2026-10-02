# Placement Guide — REST API Documentation

## Base URL
`/api`

## Endpoints

### 1. Authentication
- `POST /api/auth/register` — Register student account
- `POST /api/auth/login` — Sign in and receive JWT token
- `POST /api/auth/demo-login` — 1-click login for demo testing (`role: 'student' | 'admin'`)
- `GET  /api/auth/me` — Get current authenticated user profile
- `PUT  /api/auth/profile` — Update candidate profile & preferences

### 2. Companies
- `GET    /api/companies` — List companies with search, difficulty, and industry filters
- `GET    /api/companies/:slug` — Get company details, interview timeline rounds, linked questions, and experiences
- `POST   /api/companies` — Create company (Admin)
- `PUT    /api/companies/:id` — Update company (Admin)
- `DELETE /api/companies/:id` — Delete company (Admin)

### 3. Questions
- `GET    /api/questions` — List questions with topic, company, difficulty, frequency, and keyword search filters
- `GET    /api/questions/:id` — Get question details, explanation, code snippet, and related questions
- `POST   /api/questions/:id/toggle-progress` — Toggle mark as completed for question
- `POST   /api/questions` — Create question (Admin)
- `PUT    /api/questions/:id` — Update question (Admin)
- `DELETE /api/questions/:id` — Delete question (Admin)

### 4. Practice & Coding Sandbox
- `GET  /api/practice/quiz` — Generate adaptive practice quiz based on topic, difficulty, and count
- `POST /api/practice/quiz/submit` — Submit quiz score and record session
- `GET  /api/practice/coding` — List coding problems
- `GET  /api/practice/coding/:slug` — Get problem statement with test cases
- `POST /api/practice/coding/run` — Execute code solution against test cases and return pass/fail & runtime

### 5. AI Mock Interviews
- `POST /api/mock-interview/start` — Initialize mock session for target company & role
- `POST /api/mock-interview/evaluate` — Evaluate answer across 5 dimensions with score & suggestions
- `POST /api/mock-interview/finish` — Finish interview and save scorecard
- `GET  /api/mock-interview/history` — Get previous mock interview scorecards

### 6. Personalized Roadmaps
- `GET  /api/roadmaps` — List user roadmaps
- `POST /api/roadmaps/generate` — Generate 30/60/90-day placement curriculum
- `PUT  /api/roadmaps/:id/toggle-task` — Toggle weekly checklist task status

### 7. Resume AI
- `POST /api/resume/analyze` — Extract tech stack, projects, and generate tailored deep-dive interview questions

### 8. Bookmarks & Progress
- `GET  /api/bookmarks` — List bookmarked questions & companies
- `POST /api/bookmarks/toggle` — Add or remove bookmark
- `GET  /api/progress` — Get placement readiness score, streak, topic breakdown, and weak areas

### 9. Admin Dashboard
- `GET /api/admin/stats` — Total users, companies, questions, mock interviews, and DAU
- `GET /api/admin/users` — List all registered users
- `PUT /api/admin/users/:id/role` — Update user role ('student' | 'admin')
