# Placement Guide 
## AI-Powered Software Placement Preparation Platform

**Project Type:** Full-Stack Web Application  
**Target Users:** College students, freshers, job seekers  
**Primary Goal:** Help students prepare for software-company placements using company-specific interview experiences, round-wise questions, preparation roadmaps, mock interviews, and personalized guidance.

---

# 1. Project Overview

## 1.1 Problem Statement

Students preparing for software placements often search across multiple websites, YouTube videos, blogs, GitHub repositories, and interview-experience posts to understand:

- What rounds a company conducts
- What questions are asked in each round
- Which technical subjects should be prepared
- What coding problems are commonly asked
- What HR questions are asked
- How to prepare for a particular company
- How to evaluate their preparation level

The information is scattered and difficult to organize.

**Placement Guide** solves this problem by providing a single platform containing structured company-wise and round-wise placement information.

---

# 2. Project Vision

Build a centralized placement-preparation platform where a student can select:

**Company → Role → Round → Topic**

and immediately access relevant preparation material.

The platform should eventually provide:

> **Company-specific preparation + personalized roadmap + question bank + AI mock interview + progress tracking**

---

# 3. Target Users

## Student

Can:

- Browse companies
- View interview processes
- Practice questions
- Take quizzes
- Practice coding
- Take AI mock interviews
- Create a preparation plan
- Track progress
- Bookmark questions
- Analyze weak areas

## Admin

Can:

- Add companies
- Add interview rounds
- Add questions
- Add interview experiences
- Manage users
- Manage reported content
- View platform analytics

---

# 4. Core Features

## 4.1 Authentication

Users should be able to:

- Register
- Login
- Logout
- Reset password
- Continue with Google
- Edit profile

User profile:

```text
Name
Email
College
Degree
Branch
Graduation Year
Skills
Target Role
Target Companies
Preparation Level
```

---

# 5. Home Page

The homepage should immediately show:

### Hero Section

> **Crack Your Dream Software Placement**

Search companies, interview questions and preparation guides.

Search bar:

```text
Search company, role, question or topic...
```

### Popular Companies

Display company cards:

- Amazon
- Microsoft
- Google
- TCS
- Infosys
- Accenture
- Deloitte
- IBM
- Oracle
- Salesforce
- Zoho
- Cognizant

### Preparation Categories

```text
DSA
SQL
DBMS
OOP
Operating Systems
Computer Networks
JavaScript
React
Java
Python
System Design
HR
Aptitude
```

### Quick Actions

```text
Practice Questions
Mock Interview
Create Roadmap
Browse Companies
Track Progress
```

---

# 6. Company Directory

Create a dedicated company listing page.

Filters:

```text
Company
Industry
Role
Difficulty
Experience Level
Hiring Type
```

Each company card contains:

```text
Company Logo
Company Name
Popular Roles
Interview Rounds
Question Count
Difficulty
Last Updated
```

Example:

```text
Amazon

Roles:
Software Development Engineer

Rounds:
1. Online Assessment
2. Technical Interview
3. Leadership/Behavioral
4. HR

Questions:
250+
```

---

# 7. Company Detail Page

URL example:

```text
/company/amazon
```

Sections:

### Company Overview

- Company
- Industry
- Common roles
- Hiring type
- Eligibility information
- General process

### Interview Process

Visual timeline:

```text
Online Assessment
       ↓
Coding
       ↓
Technical Interview
       ↓
Behavioral
       ↓
HR
```

### Round Details

Each round should show:

```text
Round Name
Typical Topics
Question Types
Difficulty
Preparation Tips
Practice Questions
Reported Interview Questions
```

---

# 8. Round-Wise Question System

Every company can have multiple rounds.

Example:

```text
Amazon
 ├── Online Assessment
 │    ├── Coding
 │    ├── Aptitude
 │    └── CS Fundamentals
 │
 ├── Technical Interview
 │    ├── DSA
 │    ├── DBMS
 │    ├── OS
 │    ├── OOP
 │    └── Projects
 │
 └── Behavioral
      ├── Leadership
      └── HR
```

Questions should have:

```text
Question
Company
Role
Round
Topic
Difficulty
Question Type
Source
Year
Tags
```

---

# 9. Question Bank

The question bank is one of the main features.

## Categories

### Programming

- C
- C++
- Java
- Python
- JavaScript

### DSA

- Arrays
- Strings
- Linked Lists
- Stack
- Queue
- Trees
- Graphs
- Sorting
- Searching
- Recursion
- Dynamic Programming

### Core CS

- DBMS
- SQL
- Operating Systems
- Computer Networks
- OOP

### Web Development

- HTML
- CSS
- JavaScript
- React
- Node.js
- REST APIs

### Interview

- HR
- Behavioral
- Project-based
- Resume-based

---

# 10. Question Detail Page

Example:

```text
Question:
What is normalization in DBMS?

Topic:
DBMS

Difficulty:
Easy

Companies:
TCS, Infosys, Accenture

Question Type:
Technical Interview
```

Then provide:

### Answer

Clear beginner-friendly explanation.

### Interview Tip

Explain how the candidate should answer it.

### Related Questions

Automatically show similar questions.

### Bookmark

Allow users to save questions.

### Mark as Completed

Track preparation progress.

---

# 11. Question Frequency System

Instead of simply saying "most asked", maintain data-backed labels.

Possible labels:

```text
Frequently Reported
Occasionally Reported
Recently Reported
Topic-Based
```

Each question can contain:

```text
Reports: 18
Last reported: 2026
```

The platform should clearly distinguish reported interview experiences from official company information.

---

# 12. Interview Experience System

Students can submit their interview experiences.

Form:

```text
Company
Role
Year
College/Experience Level
Round
Questions Asked
Difficulty
Selection Result
Additional Tips
```

Example:

```text
Company: TCS
Role: Software Developer
Year: 2026

Round 1:
Aptitude + Coding

Questions:
...

Round 2:
Technical Interview

Questions:
...

Round 3:
HR

Questions:
...
```

Admin moderation should be required before publication.

---

# 13. AI Mock Interview

This is one of the project's major features.

User selects:

```text
Company
Role
Interview Type
Difficulty
Number of Questions
```

Example:

```text
Company: Amazon
Role: SDE
Round: Technical
Difficulty: Medium
Questions: 10
```

The AI interviewer asks questions one at a time.

User answers.

AI evaluates:

```text
Concept Accuracy
Communication
Completeness
Technical Depth
Problem Solving
```

Then provides:

```text
Score
Strengths
Weak Areas
Improvement Suggestions
Recommended Topics
```

Important: AI feedback should be presented as guidance, not as a definitive hiring assessment.

---

# 14. Personalized Placement Roadmap

User enters:

```text
Target Role
Target Companies
Current Skills
Preparation Time
Current Level
```

Example:

```text
Target Role:
Full Stack Developer

Preparation Time:
60 Days

Skills:
HTML ✓
CSS ✓
JavaScript ✓
React ✓
SQL 40%
DSA 20%
```

The system creates:

```text
60-DAY ROADMAP

Week 1
JavaScript fundamentals

Week 2
Advanced JavaScript

Week 3
React

Week 4
Node.js

Week 5
SQL + DBMS

Week 6
DSA

Week 7
Mock Interviews

Week 8
Company Preparation
```

---

# 15. Daily Preparation Dashboard

Dashboard should show:

```text
Good Evening, Kumar 👋

Your Placement Progress
████████░░ 72%

Today's Tasks

□ 2 DSA Problems
□ 5 SQL Questions
□ 20 DBMS Questions
□ 30 min Mock Interview

Weak Areas

🔴 Dynamic Programming
🟡 SQL Joins
🟡 Operating Systems

Streak:
12 Days 🔥
```

---

# 16. Practice Mode

Users can select:

```text
Topic
Difficulty
Question Count
Time Limit
Company
```

Example:

```text
SQL
Medium
20 Questions
30 Minutes
Company: Any
```

At the end:

```text
Score
Accuracy
Time Taken
Correct Answers
Wrong Answers
Weak Topics
```

---

# 17. Coding Practice

Coding section should support:

```text
Problem Statement
Examples
Constraints
Test Cases
Code Editor
Language Selection
Submit
```

Languages can initially include:

- JavaScript
- Python
- Java
- C++

For MVP, coding execution can be integrated through a third-party code execution API.

---

# 18. Resume-Based Interview Questions

User uploads or enters their resume.

The system extracts:

```text
Skills
Projects
Internships
Certificates
Education
Experience
```

Then generates preparation questions.

Example:

```text
Project:
E-Commerce Website

Possible Interview Questions:

1. Explain your project architecture.
2. Why did you choose React?
3. How did you handle authentication?
4. What database did you use?
5. What was the biggest challenge?
6. How would you scale this application?
```

---

# 19. Progress Tracking

Track:

```text
Questions Attempted
Questions Completed
Accuracy
Topics Completed
Mock Interviews
Coding Problems
Daily Streak
Roadmap Completion
```

Dashboard charts:

```text
Weekly Activity
Topic Performance
Company Preparation
Mock Interview Performance
```

---

# 20. Bookmark System

Users can bookmark:

- Questions
- Companies
- Interview experiences
- Roadmap topics

Create:

```text
My Bookmarks
```

with filters.

---

# 21. Search System

Global search should search:

```text
Companies
Questions
Topics
Interview Experiences
Roles
```

Example:

Search:

```text
React
```

Results:

```text
React Interview Questions
React Companies
React Coding Questions
React Roadmaps
React Mock Interview
```

---

# 22. Admin Dashboard

Admin dashboard:

```text
Total Users
Total Companies
Total Questions
Interview Experiences
Daily Active Users
Mock Interviews
Reported Content
```

Admin actions:

```text
Add Company
Edit Company
Delete Company

Add Question
Edit Question
Delete Question

Review Experience
Approve
Reject
Edit

Manage Users
```

---

# 23. Database Design

Recommended database:

**PostgreSQL**

### Users

```text
users
---------
id
name
email
password_hash
college
degree
branch
graduation_year
target_role
created_at
```

### Companies

```text
companies
---------
id
name
slug
logo_url
description
website
industry
created_at
updated_at
```

### Roles

```text
roles
---------
id
name
description
```

### Company Roles

```text
company_roles
---------
id
company_id
role_id
```

### Rounds

```text
rounds
---------
id
company_id
name
description
order_number
```

### Questions

```text
questions
---------
id
question
answer
topic
difficulty
question_type
source
created_at
updated_at
```

### Company Questions

```text
company_questions
---------
id
company_id
question_id
round_id
reported_year
frequency
```

### Interview Experiences

```text
interview_experiences
---------
id
user_id
company_id
role_id
year
content
status
created_at
```

### Bookmarks

```text
bookmarks
---------
id
user_id
question_id
created_at
```

### User Progress

```text
user_progress
---------
id
user_id
question_id
status
score
completed_at
```

### Mock Interviews

```text
mock_interviews
---------
id
user_id
company_id
role_id
type
difficulty
score
feedback
created_at
```

### Roadmaps

```text
roadmaps
---------
id
user_id
title
duration
created_at
```

### Roadmap Tasks

```text
roadmap_tasks
---------
id
roadmap_id
title
description
due_date
status
```

---

# 24. API Specification

Backend:

**Node.js + Express.js**

Authentication:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

Companies:

```text
GET    /api/companies
GET    /api/companies/:slug
POST   /api/companies
PUT    /api/companies/:id
DELETE /api/companies/:id
```

Questions:

```text
GET    /api/questions
GET    /api/questions/:id
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

Interview Experiences:

```text
GET  /api/experiences
GET  /api/experiences/:id
POST /api/experiences
PUT  /api/experiences/:id
```

Bookmarks:

```text
GET    /api/bookmarks
POST   /api/bookmarks
DELETE /api/bookmarks/:id
```

Progress:

```text
GET  /api/progress
POST /api/progress
```

Mock Interview:

```text
POST /api/mock-interview/start
POST /api/mock-interview/answer
POST /api/mock-interview/finish
GET  /api/mock-interview/:id
```

Roadmap:

```text
POST /api/roadmaps
GET  /api/roadmaps
GET  /api/roadmaps/:id
PUT  /api/roadmaps/:id/tasks/:taskId
```

---

# 25. Frontend Page Structure

```text
/
├── Home
├── Companies
├── Company Details
├── Questions
├── Question Details
├── Interview Experiences
├── Interview Experience Details
├── Practice
├── Coding
├── Mock Interview
├── Roadmap
├── Dashboard
├── Bookmarks
├── Profile
├── Login
├── Register
└── Admin
```

---

# 26. Recommended Frontend Structure

```text
src/
│
├── components/
│   ├── Navbar
│   ├── Footer
│   ├── CompanyCard
│   ├── QuestionCard
│   ├── SearchBar
│   ├── ProgressBar
│   └── InterviewTimeline
│
├── pages/
│   ├── Home
│   ├── Companies
│   ├── CompanyDetails
│   ├── Questions
│   ├── QuestionDetails
│   ├── MockInterview
│   ├── Dashboard
│   └── Admin
│
├── services/
│   ├── api.js
│   ├── auth.js
│   └── interview.js
│
├── hooks/
├── context/
├── utils/
├── assets/
└── App.jsx
```

---

# 27. Backend Structure

```text
server/
│
├── controllers/
├── routes/
├── models/
├── middleware/
├── services/
│   ├── aiService
│   ├── interviewService
│   └── roadmapService
│
├── utils/
├── config/
├── database/
└── server.js
```

---

# 28. Technology Stack

## Frontend

```text
React.js
TypeScript
Tailwind CSS
React Router
TanStack Query
Axios
Recharts
```

## Backend

```text
Node.js
Express.js
TypeScript
JWT
REST API
```

## Database

```text
PostgreSQL
Prisma ORM
```

## AI

```text
OpenAI API
```

Possible AI functionality:

```text
Question Generation
Mock Interviews
Answer Evaluation
Roadmap Generation
Resume Question Generation
Personalized Recommendations
```

## Deployment

```text
Frontend → Vercel
Backend → Render / Railway
Database → Neon / Supabase
```

---

# 29. Security Requirements

Implement:

- Password hashing
- JWT authentication
- Input validation
- Rate limiting
- API authorization
- Admin role protection
- SQL injection protection
- XSS protection
- CORS configuration
- Secure environment variables

Never expose:

```text
API keys
Database passwords
JWT secrets
```

in frontend code or GitHub.

---

# 30. Data Quality Strategy

The platform should distinguish between:

### Official Information

Information published by the company.

### Reported Interview Experience

Questions/processes submitted by candidates.

### Community Content

Tips and preparation suggestions.

This prevents users from assuming that every reported question is guaranteed to appear in a future interview.

Every interview experience should ideally contain:

```text
Company
Role
Year
Location/Program if relevant
Round
Source
Submission Date
```

---

# 31. MVP Version

Do NOT build every feature initially.

### Phase 1 — MVP

Build:

```text
Authentication
↓
Company Directory
↓
Company Details
↓
Round Information
↓
Question Bank
↓
Question Details
↓
Search
↓
Bookmarks
↓
Progress Tracking
↓
Admin Dashboard
```

Start with approximately:

```text
20 companies
500 questions
100 interview experiences
```

The content can be expanded later.

---

# 32. Phase 2

Add:

```text
Practice Mode
Quizzes
Coding Problems
Analytics
Personalized Roadmap
Interview Experience Submission
```

---

# 33. Phase 3

Add AI:

```text
AI Mock Interview
AI Answer Evaluation
Resume-Based Questions
AI Roadmap
Personalized Recommendations
```

---

# 34. Phase 4

Advanced features:

```text
Company Comparison
Placement Readiness Score
Community Discussions
Mentor System
Leaderboard
Notifications
Mobile PWA
```

---
 
# 35. Placement Readiness System

Create a preparation dashboard based on measurable activity rather than claiming to predict hiring outcomes.

Example:

```text
Preparation Overview 

DSA             72%
SQL             84%
DBMS            67%
OS              52%
OOP             80%
Projects        90%
Mock Interviews 60%
```

Then show:

```text
Recommended Next Steps

1. Practice Operating Systems
2. Complete SQL Joins
3. Take Technical Mock Interview
4. Review Project Questions
```

---

# 36. UI/UX Requirements

Design should feel like a modern developer platform.

Style:

```text
Clean
Professional
Fast
Mobile Responsive
Developer-focused
```

Use:

- Dark/light mode
- Cards
- Tabs
- Progress bars
- Search
- Filters
- Breadcrumbs
- Skeleton loading
- Toast notifications
- Empty states

Avoid excessive animations.

---

# 37. Homepage User Journey

```text
Landing Page
     ↓
Search Company
     ↓
Company Page
     ↓
Select Role
     ↓
View Interview Process
     ↓
Select Round
     ↓
Practice Questions
     ↓
Take Mock Interview
     ↓
View Performance
     ↓
Get Recommended Topics
     ↓
Continue Roadmap
```

---

# 38. Example User Journey

User wants to prepare for a software developer role.

```text
1. Register
2. Select Software Developer
3. Select target companies
4. Complete skill assessment
5. Receive preparation roadmap
6. Study questions
7. Practice coding
8. Take mock interview
9. Review weak topics
10. Continue preparation
```

---

# 39. Success Metrics

Measure:

```text
Registered Users
Daily Active Users
Questions Attempted
Questions Completed
Mock Interviews
Roadmaps Created
Interview Experiences Submitted
Average Session Time
Roadmap Completion
```

---

# 40. Future Features

Possible future versions:

### Company Job Alerts

Track selected companies' job openings.

### AI Career Assistant

Students can ask:

> "I have 45 days for placements. What should I study?"

### College Dashboard

Colleges can create placement preparation programs.

### Mentor Dashboard

Mentors can monitor student progress.

### Community

Students can discuss interview experiences.

### Notifications

Notify users about:

- New interview experiences
- New questions
- New preparation material
- Selected-company updates

---

# 41. GitHub Repository Structure

```text
placement-guide/
│
├── client/
├── server/
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── database.md
│   └── api.md
│
├── README.md
├── .gitignore
└── docker-compose.yml
```

---

# 42. Development Roadmap

## Week 1 — Planning + UI

- Finalize requirements
- Design database
- Create wireframes
- Setup GitHub
- Setup React
- Setup Node.js
- Setup PostgreSQL

## Week 2 — Authentication

- Register
- Login
- JWT
- User profile
- Protected routes

## Week 3 — Companies

- Company database
- Company listing
- Search
- Filters
- Company details

## Week 4 — Questions

- Question database
- Question listing
- Filters
- Question details
- Bookmarking

## Week 5 — Interview Experiences

- Submission form
- Admin moderation
- Experience pages
- Round-wise organization

## Week 6 — Dashboard

- Progress tracking
- Practice mode
- Statistics
- Bookmarks
- Roadmap

## Week 7 — AI

- AI question generation
- Mock interview
- Answer evaluation
- Personalized roadmap

## Week 8 — Deployment

- Testing
- Security
- Performance optimization
- Deployment
- Documentation
- Demo preparation

---

# 43. Testing

Test:

### Functional

- Authentication
- Search
- Filters
- Questions
- Bookmarks
- Progress
- Mock interview

### API

Test APIs using Postman.

### Security

Test:

- Unauthorized access
- Invalid JWT
- Input validation
- Admin authorization

### Performance

Test:

- Large question database
- Search
- Pagination
- API response times

---

# 44. Final Project Deliverables

The completed project should contain:

```text
✓ Responsive website
✓ Authentication
✓ Company database
✓ Company-wise interview guides
✓ Round-wise questions
✓ Question bank
✓ Interview experiences
✓ Search and filtering
✓ Practice mode
✓ Progress dashboard
✓ Personalized roadmap
✓ AI mock interviews
✓ Resume-based questions
✓ Admin dashboard
✓ PostgreSQL database
✓ REST APIs
✓ Deployment
✓ GitHub repository
✓ Project documentation
```

---

# 45. Resume Description

**Placement Guide — AI-Powered Placement Preparation Platform**

> Developed a full-stack placement preparation platform that organizes company-specific interview processes, round-wise technical questions, interview experiences, personalized preparation roadmaps, progress tracking, and AI-powered mock interviews. Built REST APIs, authentication, PostgreSQL data models, search/filter functionality, and AI-driven interview feedback using React, Node.js, Express, PostgreSQL, and OpenAI APIs.

---

# 46. Main USP

The project should NOT be positioned as:

> "A website containing interview questions."

Instead, position it as:

> **"An intelligent placement preparation platform that converts a student's target role and skill level into a structured, company-specific preparation journey."**

Core flow:

```text
                 STUDENT
                    ↓
            Target Role + Skills
                    ↓
            Target Companies
                    ↓
          Personalized Roadmap
                    ↓
       ┌────────────┼────────────┐
       ↓            ↓            ↓
   Questions     Coding      Mock Interview
       ↓            ↓            ↓
       └────────────┼────────────┘
                    ↓
             Progress Analysis
                    ↓
             Weak Area Detection
                    ↓
          Personalized Next Steps
                    ↓
             Placement Preparation
```

# 47. Recommended MVP Priority

Build in this exact order:

**1. Authentication**  
**2. Company database**  
**3. Company pages**  
**4. Round-wise interview information**  
**5. Question bank**  
**6. Search + filters**  
**7. Bookmarks**  
**8. Progress tracking**  
**9. Interview experiences**  
**10. Admin panel**  
**11. Personalized roadmap**  
**12. AI mock interview**

Do not start with AI. First build the **data + full-stack foundation**. Once that works, AI becomes an additional layer on top of a strong project.

# 48. Final Goal

The finished application should answer one question for a student:

> **"I want a software job. What should I prepare, what questions should I practice, what rounds should I expect, and where am I currently weak?"**

The platform should provide the complete preparation workflow from **target company → preparation → practice → mock interview → progress tracking**.