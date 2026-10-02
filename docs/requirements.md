# Placement Guide — Requirements Specification

## 1. System Objective
Placement Guide is a full-stack, AI-powered platform designed to streamline and structure software placement preparation for college students, freshers, and job seekers.

## 2. User Personas & Roles
- **Student Candidate:**
  - Browse companies, roles, and hiring criteria.
  - Study round-by-round interview process and past questions.
  - Practice questions with detailed solutions, code examples, and interview tips.
  - Take timed practice quizzes and algorithmic coding sandbox tests.
  - Simulate live AI mock interviews with 5-dimensional evaluation (Concept Accuracy, Communication, Completeness, Technical Depth, Problem Solving).
  - Generate personalized 30/60/90-day roadmaps and track daily progress.
  - Submit placement interview experiences.
- **Administrator:**
  - Full CRUD operations on companies, rounds, and question banks.
  - Moderation queue for submitted interview experiences (Approve / Reject).
  - User role management and platform metrics tracking.

## 3. Functional Requirements
- **Authentication:** JWT-based user authentication, role differentiation, profile management, and quick demo logins.
- **Company Directory:** Filter by difficulty, industry, role, and search keywords.
- **Round-Wise Question Bank:** Multi-filter support across DSA, SQL, DBMS, OS, Networks, OOP, Web, and HR.
- **AI Mock Interview:** Real-time answer evaluation, feedback, scoring, and persistent scorecard history.
- **Personalized Roadmap:** Week-by-week task checklist with dynamic progress calculation.
- **Daily Dashboard:** Readiness percentage, activity charts, weak area alerts, and daily task checklist.
