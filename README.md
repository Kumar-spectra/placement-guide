# Placement Guide 🎓
### AI-Powered Software Placement Preparation Platform

> **"An intelligent placement preparation platform that converts a student's target role and skill level into a structured, company-specific preparation journey."**

---

## 🌟 Overview
**Placement Guide** is a modern, full-stack web application designed for college students, freshers, and job seekers preparing for on-campus and off-campus software placements. It organizes company-specific interview processes, round-wise questions, interview experiences, personalized preparation roadmaps, progress tracking, and AI-powered mock interviews.

---

## 🚀 Key Features

1. **Company Directory & Hiring Guides (20+ Top Tech Companies)**
   - Amazon, Google, Microsoft, TCS, Infosys, Accenture, Deloitte, IBM, Oracle, Salesforce, Zoho, Cognizant, Uber, Meta, Adobe, Atlassian, Flipkart, Cisco, Intel, Apple.
   - Comprehensive hiring types, eligibility, popular roles, and CTC information.

2. **Visual Interactive Interview Timelines**
   - Step-by-step breakdown of Online Assessment (OA), Technical Rounds (DSA/CS/Projects), and Managerial/Behavioral HR rounds.

3. **Round-Wise Question Bank with Data-Backed Frequency**
   - Categorized by DSA, SQL, DBMS, Operating Systems, Computer Networks, OOP, Web Development, and HR STAR methods.
   - Frequency labels: *Frequently Reported*, *Occasionally Reported*, *Recently Reported*.
   - Beginner-friendly explanations, code solutions, interview strategy tips, and one-click bookmarking.

4. **Algorithmic Coding Sandbox (Live Test Runner)**
   - Interactive code editor with multi-language support (JavaScript, Python, Java, C++).
   - Automated test case execution, runtime measurement, pass/fail status, and hints.

5. **AI Mock Interview Simulator**
   - Multi-question voice/text technical and behavioral simulation.
   - 5-Dimensional AI evaluation: *Concept Accuracy, Communication Structure, Completeness, Technical Depth, Problem Solving*.
   - Detailed candidate scorecard with identified strengths, weak points, and improvement suggestions.

6. **Personalized 30/60/90-Day Placement Roadmaps**
   - Dynamic AI roadmap generator based on target company, role, and preparation duration.
   - Week-by-week actionable checklists with real-time completion tracking.

7. **AI Resume Deep-Dive Scanner**
   - Extracts tech stacks and project descriptions to formulate targeted company-fit interview questions.

8. **Daily Placement Preparation Dashboard**
   - Holistic Placement Readiness Score (e.g. 72% Readiness).
   - Daily consistency streak counter (🔥).
   - Topic performance progress bars and weekly activity charts.
   - Critical weak-area alerts with actionable next steps.

9. **Interview Experiences Archive & Submissions**
   - Peer interview reports with round breakdowns, questions, and junior advice.
   - Admin moderation workflow (Approve / Reject).

10. **Admin Control Panel**
    - Platform-wide statistics and metrics (DAU, Total Users, Questions, Mock Interviews).
    - Full CRUD management for Companies and Question Banks.
    - User role administration (Student / Admin).

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, React Router v6, Lucide React, Recharts, Canvas Confetti.
- **Backend:** Node.js, Express.js, JWT Authentication, bcryptjs, SQLite3 (Zero-config embedded DB / Postgres compatible).
- **AI Intelligence:** Smart heuristic evaluation engine + OpenAI GPT-4o-mini API integration.

---

## 🏃 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Seed Database (Preloaded with 20 companies & 100+ questions)
```bash
npm run seed
```

### 3. Start Development Servers
```bash
npm run dev
```
- **Client:** `http://localhost:5173`
- **Backend API:** `http://localhost:5001`

### 4. Demo Login Accounts
- **Demo Student:** One-click login on navbar / `student@placementguide.com` (Password: `student123`)
- **Demo Admin:** One-click login on navbar / `admin@placementguide.com` (Password: `admin123`)

---

## 📁 Repository Structure

```text
placement-guide/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, CompanyCard, QuestionCard, SearchBar, etc.
│   │   ├── pages/            # Home, Companies, Questions, MockInterview, Roadmap, etc.
│   │   ├── services/         # Typed API client
│   │   ├── context/          # Auth state
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
├── server/
│   ├── database/             # SQLite DB and seed scripts
│   ├── middleware/           # JWT and Admin authorization
│   ├── routes/               # REST API endpoints
│   ├── services/             # AI Mock and Roadmap engines
│   ├── server.js
│   └── package.json
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── database.md
│   └── api.md
├── spec.md                   # Original specification
├── package.json              # Root orchestration
└── README.md
```
