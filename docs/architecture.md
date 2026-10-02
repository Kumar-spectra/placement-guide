# Placement Guide — Architecture Documentation

## System Architecture

```
[ Client: React + TypeScript + Vite + Tailwind CSS ]
                        │
                  (REST APIs via JSON)
                        ▼
      [ Backend Server: Express.js (Node.js) ]
         ├── Auth Middleware (JWT Token Verification)
         ├── AI Service (OpenAI API / Heuristic Engine)
         ├── Coding Sandbox Runner (Safe Function Evaluator)
         └── REST Controllers (Companies, Questions, Roadmaps, etc.)
                        │
                        ▼
  [ Database: SQLite3 / PostgreSQL compatible schema ]
         ├── users, companies, rounds, questions
         ├── company_questions, coding_problems
         ├── interview_experiences, roadmaps, mock_interviews
         └── user_progress, bookmarks, practice_sessions
```

## Technology Choices
- **Frontend:** React 18 with TypeScript for type safety, Vite for fast HMR bundling, Tailwind CSS for modern developer dark UI, and Recharts for interactive analytics.
- **Backend:** Node.js + Express.js with modular routing architecture and secure JWT middleware.
- **Database:** Relational schema with foreign keys and cascade deletions, zero-config SQLite default with PostgreSQL/Prisma compatibility.
- **AI Intelligence:** Dual-mode evaluation system: heuristic keyword & depth analysis engine + direct OpenAI GPT-4o-mini integration when `OPENAI_API_KEY` is provided.
