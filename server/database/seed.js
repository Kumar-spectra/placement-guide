import bcrypt from 'bcryptjs';
import { run, all, get, initDb } from './db.js';

export const seedDatabase = async () => {
  await initDb();
  console.log('Seeding Placement Guide database...');

  // Check if already seeded
  const userCount = await get(`SELECT COUNT(*) as count FROM users`);
  if (userCount && userCount.count > 0) {
    console.log('Database already has data. Skipping full reset...');
    return;
  }

  // 1. Seed Users
  const studentPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  await run(
    `INSERT INTO users (name, email, password_hash, role, college, degree, branch, graduation_year, target_role, target_companies, skills, preparation_level)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'Kumar Babu',
      'student@placementguide.com',
      studentPassword,
      'student',
      'National Institute of Technology',
      'B.Tech',
      'Computer Science & Engineering',
      2026,
      'Full Stack SDE',
      'Amazon, Google, Microsoft, TCS, Infosys',
      'JavaScript, React, Node.js, Python, SQL, DSA, Docker',
      'Intermediate'
    ]
  );

  await run(
    `INSERT INTO users (name, email, password_hash, role, college, degree, branch, graduation_year, target_role, target_companies, skills, preparation_level)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'Platform Admin',
      'admin@placementguide.com',
      adminPassword,
      'admin',
      'Tech University',
      'M.Tech',
      'Computer Science',
      2024,
      'Lead Architect',
      'All Companies',
      'System Design, Cloud, AI, Security',
      'Expert'
    ]
  );

  // 2. Seed 20+ Companies
  const companies = [
    {
      name: 'Amazon',
      slug: 'amazon',
      logo_url: 'https://images.unsplash.com/photo-1523474253246-72cb9dcdd8b6?w=128&auto=format&fit=crop&q=80',
      description: 'Global technology giant focusing on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence.',
      website: 'https://amazon.jobs',
      industry: 'E-Commerce / Cloud / AI',
      difficulty: 'Hard',
      hiring_type: 'On-Campus (SDE-1) & Off-Campus (6-month Intern / FTE)',
      popular_roles: 'Software Development Engineer (SDE-1), Cloud Support Associate, Quality Assurance Engineer',
      eligibility: 'B.Tech/M.Tech (CS/IT/ECE/EE), Min 65% or 6.5 CGPA, No active backlogs',
      interview_overview: 'Amazon uses 14 Leadership Principles alongside rigorous DSA, low-level design, and system optimization rounds.'
    },
    {
      name: 'Google',
      slug: 'google',
      logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
      description: 'World leading technology multinational specializing in search engine technology, online advertising, cloud computing, and AI (Gemini).',
      website: 'https://careers.google.com',
      industry: 'Search / AI / Cloud',
      difficulty: 'Hard',
      hiring_type: 'On-Campus / Google Girl Hackathon / Off-Campus Careers',
      popular_roles: 'Software Engineer (L3), Application Engineer, Data Scientist',
      eligibility: 'B.Tech/M.Tech/MCA/MS in Computer Science or related STEM field',
      interview_overview: 'Google emphasizes clean code, time/space complexity analysis, problem-solving speed, and Googliness/leadership.'
    },
    {
      name: 'Microsoft',
      slug: 'microsoft',
      logo_url: 'https://images.unsplash.com/photo-1642132652806-8178d8a707a2?w=128&auto=format&fit=crop&q=80',
      description: 'Global tech leader developing Windows, Azure cloud services, developer tooling (VS Code, GitHub), and AI solutions (Copilot).',
      website: 'https://careers.microsoft.com',
      industry: 'Software / Cloud / OS',
      difficulty: 'Hard',
      hiring_type: 'On-Campus / Microsoft Engage / Off-Campus',
      popular_roles: 'Software Engineer, Support Engineer, Cloud Solution Architect',
      eligibility: 'B.Tech / M.Tech / Dual Degree, 7.0+ CGPA, 0 active backlogs',
      interview_overview: 'Focuses heavily on Data Structures, Algorithms, OS internals, OOP, and system edge-case handling.'
    },
    {
      name: 'TCS',
      slug: 'tcs',
      logo_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
      description: 'Tata Consultancy Services is an Indian multinational IT services and consulting powerhouse operating in 150+ locations across 46 countries.',
      website: 'https://www.tcs.com/careers',
      industry: 'IT Services / Enterprise Consulting',
      difficulty: 'Medium',
      hiring_type: 'TCS NQT (National Qualifier Test) - Ninja / Digital / Prime cadres',
      popular_roles: 'TCS Prime (9 LPA), TCS Digital (7 LPA), TCS Ninja (3.6 LPA)',
      eligibility: 'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc, Minimum 60% aggregate in 10th, 12th, and Graduation',
      interview_overview: 'TCS tests quantitative aptitude, logical reasoning, verbal ability, advanced coding, followed by TR (Technical) and MR/HR rounds.'
    },
    {
      name: 'Infosys',
      slug: 'infosys',
      logo_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80',
      description: 'Global leader in next-generation digital services and consulting enabling clients across 50+ countries to navigate digital transformation.',
      website: 'https://www.infosys.com/careers',
      industry: 'IT Services / Digital Transformation',
      difficulty: 'Medium',
      hiring_type: 'InfyTQ / HackWithInfy / Campus Recruitment',
      popular_roles: 'Specialist Programmer (SP - 9.5 LPA), Digital Specialist Engineer (DSE - 6.25 LPA), Systems Engineer (SE - 3.6 LPA)',
      eligibility: 'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc with minimum 60% or 6.0 CGPA',
      interview_overview: 'Combines algorithmic coding, DBMS queries, Java/Python OOP principles, and HR behavioral verification.'
    },
    {
      name: 'Accenture',
      slug: 'accenture',
      logo_url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=128&auto=format&fit=crop&q=80',
      description: 'Leading global professional services company providing strategy, consulting, digital, technology and operations services.',
      website: 'https://www.accenture.com/careers',
      industry: 'IT Consulting / Digital Solutions',
      difficulty: 'Medium',
      hiring_type: 'On-Campus Drive / Off-Campus Assessment',
      popular_roles: 'Advanced Application Engineering Analyst (AEE - 6.5 LPA), Associate Software Engineer (ASE - 4.5 LPA)',
      eligibility: 'All Engineering streams, Minimum 65% aggregate, Maximum 1 year education gap',
      interview_overview: 'Cognitive & Technical Assessment + Coding Round + Communication Assessment + Virtual Technical/HR Interview.'
    },
    {
      name: 'Deloitte',
      slug: 'deloitte',
      logo_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=128&auto=format&fit=crop&q=80',
      description: 'One of the Big Four accounting and professional services networks, providing audit, consulting, tax and advisory services with deep tech capabilities.',
      website: 'https://www2.deloitte.com/careers',
      industry: 'Consulting / Enterprise Technology',
      difficulty: 'Medium',
      hiring_type: 'Deloitte Collegiate Assessment / On-Campus Recruitment',
      popular_roles: 'Analyst - Technology Consulting, Associate Solution Advisor, Cyber Security Analyst',
      eligibility: 'B.Tech/BE in CS/IT/ECE/EEE, 60% throughout 10th, 12th, and UG',
      interview_overview: 'Aptitude test, Technical test (SQL, DSA, Cloud), JAM session / Group Discussion, and Partner/HR Interview.'
    },
    {
      name: 'IBM',
      slug: 'ibm',
      logo_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=128&auto=format&fit=crop&q=80',
      description: 'Global tech innovator in hybrid cloud, enterprise AI (watsonx), quantum computing, and mainframe enterprise infrastructure.',
      website: 'https://www.ibm.com/careers',
      industry: 'Hybrid Cloud / AI / Enterprise Software',
      difficulty: 'Medium',
      hiring_type: 'IBM CodeKnack / Campus Recruitment Drive',
      popular_roles: 'Associate System Engineer (ASE), Full Stack Developer, Data Engineer',
      eligibility: 'B.E/B.Tech/M.E/M.Tech/MCA with 65% or 6.5 CGPA, no active backlogs',
      interview_overview: 'Cognitive Game-based Assessment + English Assessment + Coding Round (HackerRank) + Technical & HR Round.'
    },
    {
      name: 'Oracle',
      slug: 'oracle',
      logo_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=128&auto=format&fit=crop&q=80',
      description: 'Leading provider of enterprise database software, Oracle Cloud Infrastructure (OCI), ERP applications, and Java runtime ecosystem.',
      website: 'https://www.oracle.com/corporate/careers',
      industry: 'Databases / Cloud Infrastructure / ERP',
      difficulty: 'Hard',
      hiring_type: 'On-Campus / University Hiring Portal',
      popular_roles: 'Associate Applications Developer, Server Technology Engineer, Cloud Infrastructure Engineer',
      eligibility: 'B.Tech/M.Tech (CS/IT/ECE/EE), Min 7.0 CGPA throughout academics',
      interview_overview: 'High emphasis on advanced SQL, Database internals, OS memory management, concurrency, and tree/graph DSA.'
    },
    {
      name: 'Salesforce',
      slug: 'salesforce',
      logo_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=128&auto=format&fit=crop&q=80',
      description: 'The world’s #1 CRM platform, pioneering enterprise multi-tenant cloud architecture, Agentforce AI, and developer platform tooling.',
      website: 'https://www.salesforce.com/company/careers',
      industry: 'Cloud SaaS / Enterprise CRM / AI',
      difficulty: 'Hard',
      hiring_type: 'Futureforce University Recruiting',
      popular_roles: 'Associate Member of Technical Staff (AMTS - 25+ LPA), Member of Technical Staff (MTS)',
      eligibility: 'B.Tech/M.Tech in CS/IT/Circuital with 7.5+ CGPA',
      interview_overview: 'HackerRank OA (2 Hard DSA) + 3 Technical Rounds (DSA, Object Oriented Design, Concurrency) + 1 Managerial/Culture round.'
    },
    {
      name: 'Zoho',
      slug: 'zoho',
      logo_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=128&auto=format&fit=crop&q=80',
      description: 'Bootstrapped technology enterprise creating a comprehensive suite of online business, productivity, and collaboration applications.',
      website: 'https://www.zoho.com/careers',
      industry: 'SaaS / Product Development',
      difficulty: 'Medium-Hard',
      hiring_type: 'Off-Campus Recruitment Drive / College Drives',
      popular_roles: 'Software Developer (6 - 10 LPA), Quality Assurance Engineer, Product Consultant',
      eligibility: 'Any graduate degree, no percentage criteria - purely skills based',
      interview_overview: 'Round 1: C/Java Aptitude & Flowcharts, Round 2: Basic Programming, Round 3: Advanced Programming / App Design, Round 4: Technical & HR.'
    },
    {
      name: 'Cognizant',
      slug: 'cognizant',
      logo_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=128&auto=format&fit=crop&q=80',
      description: 'American multinational technology company providing business consulting, information technology, and outsourcing services.',
      website: 'https://careers.cognizant.com',
      industry: 'IT Services / Digital Transformation',
      difficulty: 'Medium',
      hiring_type: 'Cognizant GenC / GenC Elevate / GenC Next',
      popular_roles: 'GenC Next (6.75 LPA), GenC Elevate (4.25 LPA), GenC (4.0 LPA)',
      eligibility: 'BE/B.Tech/ME/M.Tech/MCA/M.Sc with min 60% marks and maximum 1 year gap',
      interview_overview: 'Skill assessment (Aptitude, Code debugging, DSA, SQL) followed by combined Technical and HR interview.'
    },
    {
      name: 'Uber',
      slug: 'uber',
      logo_url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=128&auto=format&fit=crop&q=80',
      description: 'Pioneering mobility and delivery platform with ultra-scalable microservices architecture, real-time routing, and dispatch systems.',
      website: 'https://www.uber.com/careers',
      industry: 'Mobility / Distributed Systems',
      difficulty: 'Hard',
      hiring_type: 'Uber HackTag / Campus Placements / Careers',
      popular_roles: 'Software Engineer I (35+ LPA), Data Engineer, Operations Analyst',
      eligibility: 'B.Tech/M.Tech/Dual Degree in CS/IT/Math and Computing, 7.5+ CGPA',
      interview_overview: 'High performance DSA (Graphs, DP, Trees), Low-Level Object Oriented System Design, and Concurrency problems.'
    },
    {
      name: 'Meta',
      slug: 'meta',
      logo_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=128&auto=format&fit=crop&q=80',
      description: 'Global leader in social technologies, virtual reality (Reality Labs), and open source AI models (Llama, PyTorch).',
      website: 'https://www.metacareers.com',
      industry: 'Social Media / AI / VR',
      difficulty: 'Hard',
      hiring_type: 'University Grad / Global Campus Hiring',
      popular_roles: 'Software Engineer (E3), Research Scientist, Infrastructure Engineer',
      eligibility: 'B.S/B.Tech/M.S in Computer Science, 0 active backlogs',
      interview_overview: 'Speed and bug-free DSA execution (2 medium/hard problems in 45 mins), system architecture, and behavioral assessment.'
    },
    {
      name: 'Adobe',
      slug: 'adobe',
      logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=128&auto=format&fit=crop&q=80',
      description: 'World leader in digital media and digital marketing solutions (Photoshop, Acrobat, Creative Cloud, Firefly Generative AI).',
      website: 'https://www.adobe.com/careers',
      industry: 'Creative Software / Document Cloud / AI',
      difficulty: 'Hard',
      hiring_type: 'Adobe SheCodes / On-Campus / Off-Campus Drives',
      popular_roles: 'Software Development Engineer - 1 (22+ LPA), Quality Engineer',
      eligibility: 'B.Tech/M.Tech (CS/IT/Circuital), Minimum 7.0 CGPA',
      interview_overview: 'Rigorous DSA (Strings, Matrix, Trees), C++/Java Core concepts, Operating Systems, and Project Deep-dive.'
    },
    {
      name: 'Atlassian',
      slug: 'atlassian',
      logo_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=128&auto=format&fit=crop&q=80',
      description: 'Enterprise collaboration software leader behind Jira, Confluence, Trello, and Bitbucket.',
      website: 'https://www.atlassian.com/company/careers',
      industry: 'Enterprise Software / Productivity',
      difficulty: 'Hard',
      hiring_type: 'Campus Drives / University Grad Hiring',
      popular_roles: 'Associate Software Engineer (25+ LPA), Site Reliability Engineer',
      eligibility: 'B.Tech/M.Tech in CS/IT or related, 7.0+ CGPA',
      interview_overview: 'Code Design (crafting extensible, tested code), Data Structures, and strong Values Interview (Open Company No Bullshit).'
    },
    {
      name: 'Flipkart',
      slug: 'flipkart',
      logo_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=128&auto=format&fit=crop&q=80',
      description: 'India’s homegrown e-commerce marketplace empowering millions of consumers, sellers, and small businesses.',
      website: 'https://www.flipkartcareers.com',
      industry: 'E-Commerce / Supply Chain Tech',
      difficulty: 'Hard',
      hiring_type: 'Flipkart GRiD Challenge / On-Campus Recruitment',
      popular_roles: 'Software Development Engineer - 1 (20+ LPA), Business Analyst',
      eligibility: 'B.E/B.Tech/M.Tech in CS/IT/ECE/EE with 7.0+ CGPA',
      interview_overview: 'Machine Coding round (implement working design in 90 mins), Problem Solving (DSA), and System Architecture.'
    },
    {
      name: 'Cisco',
      slug: 'cisco',
      logo_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=128&auto=format&fit=crop&q=80',
      description: 'Worldwide leader in networking hardware, cybersecurity, cloud observability, and enterprise communications.',
      website: 'https://www.cisco.com/c/en/us/about/careers.html',
      industry: 'Networking / Cybersecurity / Cloud',
      difficulty: 'Medium-Hard',
      hiring_type: 'Cisco Ideathon / Campus Placements',
      popular_roles: 'Software Engineer - Internal Applications (15+ LPA), Network Consulting Engineer',
      eligibility: 'B.Tech/BE in CS/IT/ECE/EE with 7.0+ CGPA',
      interview_overview: 'Computer Networks (TCP/IP, Subnetting, Routing protocols), C/C++/Python, OS internals, and DSA.'
    },
    {
      name: 'Intel',
      slug: 'intel',
      logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&auto=format&fit=crop&q=80',
      description: 'Global semiconductor and computing powerhouse innovating microprocessors, AI accelerators, and silicon architectures.',
      website: 'https://www.intel.com/content/www/us/en/jobs/jobs-at-intel.html',
      industry: 'Semiconductors / Hardware & Software Systems',
      difficulty: 'Hard',
      hiring_type: 'University Recruiting / Campus Connect',
      popular_roles: 'Software Development Engineer, Firmware Engineer, AI Frameworks Engineer',
      eligibility: 'B.Tech/M.Tech in CS/ECE/VLSI with minimum 7.0 CGPA',
      interview_overview: 'C/C++, Computer Architecture, OS Memory Management, Device Drivers, Multithreading, and DSA.'
    },
    {
      name: 'Apple',
      slug: 'apple',
      logo_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&auto=format&fit=crop&q=80',
      description: 'Global pioneer in consumer electronics, iOS/macOS operating systems, Apple Silicon chips, and digital cloud services.',
      website: 'https://www.apple.com/careers',
      industry: 'Consumer Tech / Operating Systems / Silicon',
      difficulty: 'Hard',
      hiring_type: 'University Programs / Selected Tier-1 Campus Drives',
      popular_roles: 'Software Engineer, CoreOS Engineer, Machine Learning Engineer',
      eligibility: 'B.S/B.Tech/M.S in CS/EE with exceptional engineering track record',
      interview_overview: 'Deep dive into computer fundamentals (OS, Memory, Compilers), High performance coding, and design aesthetics.'
    }
  ];

  for (const comp of companies) {
    const res = await run(
      `INSERT INTO companies (name, slug, logo_url, description, website, industry, difficulty, hiring_type, popular_roles, eligibility, interview_overview)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comp.name,
        comp.slug,
        comp.logo_url,
        comp.description,
        comp.website,
        comp.industry,
        comp.difficulty,
        comp.hiring_type,
        comp.popular_roles,
        comp.eligibility,
        comp.interview_overview
      ]
    );

    const compId = res.id;

    // Add company rounds
    const rounds = [
      {
        name: 'Round 1: Online Assessment (OA)',
        description: 'Automated test testing aptitude, CS fundamentals, and 2-3 algorithmic coding problems.',
        typical_topics: 'Data Structures, Aptitude, Speed Coding, Time Complexity',
        question_types: 'MCQ & Online Coding',
        difficulty: comp.difficulty === 'Hard' ? 'Medium-Hard' : 'Medium',
        preparation_tips: 'Focus on speed, write modular code, and test edge cases like empty arrays and large inputs.',
        order_number: 1
      },
      {
        name: 'Round 2: Technical Interview - DSA & Core CS',
        description: '1-on-1 live coding session focusing on problem solving, trees, graphs, strings, DBMS, and OS.',
        typical_topics: 'Trees, Graphs, DP, SQL Queries, OS Concurrency, OOP Principles',
        question_types: 'Live Coding & Deep CS Q&A',
        difficulty: comp.difficulty,
        preparation_tips: 'Speak your thought process aloud before writing code. Analyze time and space complexity clearly.',
        order_number: 2
      },
      {
        name: 'Round 3: Technical Interview - Projects & System Design',
        description: 'Detailed walkthrough of resume projects, architecture trade-offs, API design, and DB schema.',
        typical_topics: 'Project Architecture, REST APIs, Caching, Database Indexing, Scalability',
        question_types: 'System Design & Code Walkthrough',
        difficulty: 'Medium-Hard',
        preparation_tips: 'Know every line of code on your resume. Be ready to explain why you chose a specific database or framework.',
        order_number: 3
      },
      {
        name: 'Round 4: Managerial / Behavioral & HR',
        description: 'Evaluation of team collaboration, conflict resolution, cultural alignment, and career aspirations.',
        typical_topics: 'Conflict resolution, Ownership, Adaptability, Situational Questions (STAR method)',
        question_types: 'Behavioral & Situational Questions',
        difficulty: 'Medium',
        preparation_tips: 'Use the STAR (Situation, Task, Action, Result) format for every answer. Research company values thoroughly.',
        order_number: 4
      }
    ];

    for (const r of rounds) {
      await run(
        `INSERT INTO rounds (company_id, name, description, typical_topics, question_types, difficulty, preparation_tips, order_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [compId, r.name, r.description, r.typical_topics, r.question_types, r.difficulty, r.preparation_tips, r.order_number]
      );
    }
  }

  // 3. Seed Comprehensive Question Bank
  const questionsData = [
    // DBMS / SQL
    {
      question: 'What is Database Normalization and explain 1NF, 2NF, 3NF, and BCNF?',
      topic: 'DBMS',
      subtopic: 'Normalization',
      difficulty: 'Easy',
      question_type: 'Technical Interview',
      source: 'TCS, Infosys, Accenture, Cognizant, Amazon',
      interview_tip: 'Define Normalization as the process of organizing data to reduce redundancy and improve data integrity. Then walk through each normal form with a simple table example (e.g. Student-Course table).',
      answer: `**Normalization** is the systematic approach of decomposing tables to eliminate data redundancy (repetition) and undesirable characteristics like Insertion, Update, and Deletion Anomalies.

### Normal Forms Breakdown:
1. **First Normal Form (1NF):**
   - Each column must contain atomic (single) values.
   - No repeating groups or arrays in columns.
   - Each row must have a unique identifier (Primary Key).

2. **Second Normal Form (2NF):**
   - Table must be in 1NF.
   - Eliminates **Partial Dependency**: No non-prime attribute should be dependent on a proper subset of any candidate key (only applies to composite keys).

3. **Third Normal Form (3NF):**
   - Table must be in 2NF.
   - Eliminates **Transitive Dependency**: Non-prime attributes must not depend on other non-prime attributes ($X \\to Y$ where neither is a candidate key).
   - Rule: "Every non-key attribute must depend on the key, the whole key, and nothing but the key."

4. **Boyce-Codd Normal Form (BCNF):**
   - Stricter version of 3NF.
   - For every functional dependency $X \\to Y$, $X$ must be a **Super Key**.`,
      code_snippet: `-- Example of converting unnormalized table into 3NF
CREATE TABLE Students (
  student_id INT PRIMARY KEY,
  name VARCHAR(100),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

CREATE TABLE Departments (
  department_id INT PRIMARY KEY,
  department_name VARCHAR(100),
  hod_name VARCHAR(100)
);`,
      tags: 'DBMS, Normalization, SQL, Core CS',
      companies_linked: ['tcs', 'infosys', 'accenture', 'cognizant', 'amazon']
    },
    {
      question: 'What are ACID properties in DBMS? Explain each with a real banking transaction example.',
      topic: 'DBMS',
      subtopic: 'Transactions',
      difficulty: 'Easy',
      question_type: 'Technical Interview',
      source: 'Amazon, Microsoft, Oracle, TCS, Deloitte',
      interview_tip: 'Always illustrate ACID using a money transfer scenario: transferring $100 from Account A to Account B. This shows clear practical understanding.',
      answer: `**ACID properties** are a set of guarantees that ensure database transactions are processed reliably and maintain integrity.

### Real-World Example: Transferring ₹5,000 from Alice to Bob
1. **Atomicity (All or Nothing):**
   - Either the entire transaction happens (Alice is debited ₹5,000 AND Bob is credited ₹5,000), or nothing happens. If the server crashes mid-way, the transaction rolls back completely.
2. **Consistency (Preserves Rules):**
   - Database moves from one valid state to another. If account balance cannot drop below zero, a transfer that violates this rule is rejected. Total money across system ($Alice + Bob$) remains invariant.
3. **Isolation (Concurrent Independence):**
   - Multiple transactions executing simultaneously do not interfere with one another. Alice transferring money to Bob at the same time Charlie transfers to Alice yields exact expected results.
4. **Durability (Permanent Changes):**
   - Once a transaction is committed (e.g. "Transfer Successful"), the changes persist in non-volatile storage (WAL/Disk) even if a power failure occurs immediately afterward.`,
      code_snippet: `BEGIN TRANSACTION;
  UPDATE Accounts SET balance = balance - 5000 WHERE account_no = 'ALICE123';
  UPDATE Accounts SET balance = balance + 5000 WHERE account_no = 'BOB456';
COMMIT;`,
      tags: 'DBMS, Transactions, ACID, Banking, Core CS',
      companies_linked: ['amazon', 'microsoft', 'oracle', 'tcs', 'deloitte']
    },
    {
      question: 'Write a SQL query to find the N-th highest salary from an Employee table.',
      topic: 'SQL',
      subtopic: 'Advanced Queries',
      difficulty: 'Medium',
      question_type: 'Technical Interview',
      source: 'Amazon, Microsoft, Flipkart, Oracle, TCS Digital',
      interview_tip: 'Provide both standard `DENSE_RANK()` window function approach and the subquery/LIMIT approach. Mention why `DENSE_RANK()` is preferred for handling ties.',
      answer: `To find the N-th highest salary, we must handle duplicate salaries gracefully.

### Approach 1: Using \`DENSE_RANK()\` Window Function (Recommended)
\`DENSE_RANK()\` assigns consecutive ranks without skipping numbers when duplicates exist.

\`\`\`sql
WITH RankedSalaries AS (
  SELECT 
    id, 
    name, 
    salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) as rank_num
  FROM Employee
)
SELECT salary 
FROM RankedSalaries 
WHERE rank_num = 2; -- replace 2 with N
\`\`\`

### Approach 2: Using \`LIMIT\` and \`OFFSET\` (MySQL/PostgreSQL)
\`\`\`sql
SELECT DISTINCT salary 
FROM Employee 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1; -- (N - 1) for N-th
\`\`\`

### Approach 3: Correlated Subquery (Generic ANSI SQL)
\`\`\`sql
SELECT DISTINCT e1.salary
FROM Employee e1
WHERE (
  SELECT COUNT(DISTINCT e2.salary)
  FROM Employee e2
  WHERE e2.salary > e1.salary
) = 1; -- (N - 1)
\`\`\``,
      code_snippet: `SELECT DISTINCT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rnk 
  FROM Employee
) WHERE rnk = :N;`,
      tags: 'SQL, Window Functions, DENSE_RANK, Queries',
      companies_linked: ['amazon', 'microsoft', 'flipkart', 'oracle', 'tcs']
    },
    {
      question: 'Explain the difference between clustered and non-clustered indexes in SQL.',
      topic: 'SQL',
      subtopic: 'Indexing',
      difficulty: 'Medium',
      question_type: 'Technical Interview',
      source: 'Microsoft, Oracle, Amazon, Uber',
      interview_tip: 'Use the book analogy: Clustered index is like the actual page numbers in a book (data is physically ordered); Non-clustered index is like the index at the back of the book (pointers to pages).',
      answer: `Indexes in databases speed up retrieval operations at the cost of additional storage and slower write operations.

### Key Differences:
| Feature | Clustered Index | Non-Clustered Index |
|---|---|---|
| **Physical Ordering** | Dictates the physical order of rows in the table | Does not change physical order; stores pointers to rows |
| **Quantity** | Only **1** per table | Multiple (**up to 999** in SQL Server) |
| **Storage** | Leaf nodes contain the actual data pages | Leaf nodes contain row locators / pointers to data |
| **Default Creation** | Automatically created on \`PRIMARY KEY\` | Automatically created on \`UNIQUE\` constraints |
| **Performance** | Faster for range queries (\`BETWEEN\`, \`>\`, \`<\`) | Faster for point lookups on specific indexed columns |`,
      code_snippet: `-- Creating a non-clustered index on email column
CREATE INDEX idx_user_email ON Users(email);`,
      tags: 'SQL, Database Indexing, B-Trees, Performance',
      companies_linked: ['microsoft', 'oracle', 'amazon', 'uber']
    },
    // DSA
    {
      question: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target (Two Sum).',
      topic: 'DSA',
      subtopic: 'Arrays & Hash Maps',
      difficulty: 'Easy',
      question_type: 'Online Assessment & Coding Round',
      source: 'Google, Amazon, Microsoft, Meta, Apple, Adobe',
      interview_tip: 'Start by explaining the naive $O(N^2)$ brute force approach with nested loops. Then optimize to $O(N)$ time using a Hash Map lookup.',
      answer: `### Problem Breakdown
Given an array and target, we need to find $i$ and $j$ ($i \\neq j$) such that $nums[i] + nums[j] = target$.

### Optimal Strategy: Hash Map Single Pass
As we iterate through the array:
1. For each number $x = nums[i]$, calculate the required complement: $complement = target - x$.
2. Check if $complement$ already exists in our Hash Map.
3. If it exists, return \`[map.get(complement), i]\`.
4. Otherwise, record the current number and index: \`map.set(x, i)\`.

### Complexity:
- **Time Complexity:** $O(N)$ since hash table lookups take $O(1)$ on average.
- **Space Complexity:** $O(N)$ to store up to $N$ elements in the map.`,
      code_snippet: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      tags: 'DSA, Arrays, Hash Table, LeetCode Easy',
      companies_linked: ['google', 'amazon', 'microsoft', 'meta', 'apple', 'adobe']
    },
    {
      question: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid (Valid Parentheses).',
      topic: 'DSA',
      subtopic: 'Stack',
      difficulty: 'Easy',
      question_type: 'Coding Round',
      source: 'Amazon, Microsoft, Google, TCS Digital, Zoho',
      interview_tip: 'Emphasize why Stack is the natural data structure: the last opened bracket must be the first one closed (LIFO principle).',
      answer: `### Approach:
1. Initialize an empty stack.
2. Iterate through each character of the string:
   - If it is an opening bracket (\`(\`, \`{\`, \`[\`), push it onto the stack.
   - If it is a closing bracket, check if the stack is empty. If empty, return \`false\`.
   - Pop the top bracket from the stack and verify that it matches the corresponding opening bracket.
3. After scanning all characters, if the stack is completely empty, return \`true\`; otherwise \`false\`.

### Complexity:
- **Time Complexity:** $O(N)$ where $N$ is string length.
- **Space Complexity:** $O(N)$ in the worst case (e.g. all opening brackets).`,
      code_snippet: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
      tags: 'DSA, Stack, Strings, LeetCode Easy',
      companies_linked: ['amazon', 'microsoft', 'google', 'tcs', 'zoho']
    },
    {
      question: 'Reverse a Singly Linked List iteratively and recursively.',
      topic: 'DSA',
      subtopic: 'Linked Lists',
      difficulty: 'Easy',
      question_type: 'Technical Interview',
      source: 'Amazon, Microsoft, TCS, Infosys, Cognizant, IBM',
      interview_tip: 'Always draw out 3 pointers on the whiteboard: \`prev\`, \`curr\`, and \`next\`. Mention the difference in space complexity between iterative $O(1)$ and recursive $O(N)$ call stack.',
      answer: `### 1. Iterative Method (Three-Pointer Approach)
Maintain three pointers:
- \`prev\` initialized to \`null\`
- \`curr\` initialized to \`head\`
- \`next\` temporary pointer

In a loop while \`curr !== null\`:
1. Save \`next = curr.next\`
2. Reverse pointer: \`curr.next = prev\`
3. Advance \`prev = curr\`
4. Advance \`curr = next\`
5. Return \`prev\` as new head.

### 2. Recursive Method
Base cases: if \`head === null || head.next === null\`, return \`head\`.
Recursively reverse the rest of the list, then rewire:
\`\`\`javascript
head.next.next = head;
head.next = null;
\`\`\``,
      code_snippet: `// Iterative Implementation
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      tags: 'DSA, Linked List, Pointers, Recursion',
      companies_linked: ['amazon', 'microsoft', 'tcs', 'infosys', 'cognizant', 'ibm']
    },
    {
      question: 'Find the Length of Longest Substring Without Repeating Characters (Sliding Window).',
      topic: 'DSA',
      subtopic: 'Sliding Window',
      difficulty: 'Medium',
      question_type: 'Coding Round',
      source: 'Google, Amazon, Meta, Microsoft, Uber, Atlassian',
      interview_tip: 'Explain the sliding window technique using two pointers: \`left\` and \`right\`. Show how a map stores the last seen index of each character to skip redundant iterations.',
      answer: `### Problem Strategy:
Use a sliding window with two pointers \`left\` and \`right\`.
A Hash Map records \`char -> lastIndex\`.

As \`right\` advances:
1. If character has been seen and its previous index $\\ge left$, jump \`left = lastIndex + 1\`.
2. Update the character's last seen index: \`map[char] = right\`.
3. Compute window length: $maxLength = \\max(maxLength, right - left + 1)$.

### Complexity:
- **Time:** $O(N)$ single pass over the string.
- **Space:** $O(\\min(N, M))$ where $M$ is the size of the character alphabet.`,
      code_snippet: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
      tags: 'DSA, Sliding Window, Strings, Hash Table',
      companies_linked: ['google', 'amazon', 'meta', 'microsoft', 'uber', 'atlassian']
    },
    {
      question: 'Design and implement an LRU (Least Recently Used) Cache with O(1) get and put operations.',
      topic: 'DSA',
      subtopic: 'System Design & Data Structures',
      difficulty: 'Hard',
      question_type: 'Technical Interview',
      source: 'Amazon, Google, Microsoft, Uber, Flipkart, Salesforce',
      interview_tip: 'Explain why combining a Doubly Linked List + Hash Map is necessary: Hash Map gives $O(1)$ lookup, Doubly Linked List gives $O(1)$ node removal and insertion.',
      answer: `### Architecture:
1. **Doubly Linked List:**
   - Nodes contain \`key\`, \`val\`, \`prev\`, \`next\`.
   - Pseudo head and pseudo tail pointers make insertion and deletion code clean without edge null checks.
   - Most recently used item is placed at the head (after dummy head).
   - Least recently used item sits right before dummy tail.

2. **Hash Map:**
   - Maps \`key -> Node reference\`.
   - Allows finding the node in $O(1)$ time to detach and move it to the front.

### Operations:
- \`get(key)\`: Look up in map. If exists, move node to head, return value. Otherwise return \`-1\`.
- \`put(key, value)\`: If key exists, update value and move to head. If new, create node and insert at head. If capacity exceeded, remove LRU node from tail and delete from map.`,
      code_snippet: `class Node {
  constructor(key = 0, val = 0) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new Node();
    this.tail = new Node();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  
  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
  
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node);
    return node.val;
  }
  
  put(key, value) {
    if (this.map.has(key)) {
      this._remove(this.map.get(key));
    }
    const node = new Node(key, value);
    this._add(node);
    this.map.set(key, node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,
      tags: 'DSA, LRU Cache, Doubly Linked List, Hash Table, Hard',
      companies_linked: ['amazon', 'google', 'microsoft', 'uber', 'flipkart', 'salesforce']
    },
    // Core CS: OS & Networks
    {
      question: 'What is the difference between a Process and a Thread? Explain Context Switching.',
      topic: 'Operating Systems',
      subtopic: 'Process Management',
      difficulty: 'Easy',
      question_type: 'Technical Interview',
      source: 'Amazon, Microsoft, TCS, Infosys, Cisco, Intel',
      interview_tip: 'Highlight memory isolation (process has its own address space, threads share the same address space) and context switching overhead.',
      answer: `### Process vs Thread:
- **Process:** An executing instance of a program. It has its own dedicated address space, memory map (code, data, heap, stack), file descriptors, and security context.
- **Thread:** A lightweight unit of execution within a process. Multiple threads of the same process share the code, data, heap, and open files, but each thread possesses its own **Program Counter (PC)**, **Register set**, and **Call Stack**.

### Key Comparisons:
| Feature | Process | Thread |
|---|---|---|
| **Memory** | Isolated address space | Shared address space within process |
| **Creation Overhead** | Heavy (requires OS allocation) | Lightweight |
| **Communication** | Inter-Process Communication (IPC: Pipes, Sockets, Shared Memory) | Direct memory access / synchronized variables |
| **Crash Impact** | Process crash does not affect other processes | Unhandled thread exception can crash the whole process |

### Context Switching:
Context switching is the mechanism where the CPU saves the state of the currently running process/thread (PCB/TCB) and loads the state of the next ready process/thread from the ready queue. Thread context switching is significantly faster than process switching because it avoids flushing the **TLB (Translation Lookaside Buffer)** and reloading virtual memory page tables.`,
      code_snippet: null,
      tags: 'OS, Process, Thread, Concurrency, Core CS',
      companies_linked: ['amazon', 'microsoft', 'tcs', 'infosys', 'cisco', 'intel']
    },
    {
      question: 'What are the four necessary conditions for Deadlock? How can deadlocks be prevented or avoided?',
      topic: 'Operating Systems',
      subtopic: 'Deadlocks',
      difficulty: 'Medium',
      question_type: 'Technical Interview',
      source: 'Microsoft, Oracle, Amazon, Cisco, IBM',
      interview_tip: 'Memorize the acronym Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait. Mention Banker\'s Algorithm for avoidance.',
      answer: `A **Deadlock** occurs when a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process.

### The 4 Coffman Conditions (All must hold simultaneously):
1. **Mutual Exclusion:** At least one resource must be held in a non-shareable mode (only one process can use it at a time).
2. **Hold and Wait:** A process must be holding at least one resource and actively waiting to acquire additional resources held by other processes.
3. **No Preemption:** Resources cannot be forcibly taken away from a process; they can only be released voluntarily after the process finishes its task.
4. **Circular Wait:** A closed chain of processes exists such that $P_0$ waits for resource held by $P_1$, $P_1$ waits for $P_2$, ..., and $P_n$ waits for $P_0$.

### Handling Strategies:
- **Prevention:** Invalidate at least one of the 4 conditions (e.g. enforce total resource ordering to eliminate Circular Wait).
- **Avoidance:** Dynamically examine resource allocation state to ensure system never enters an unsafe state (using **Banker’s Algorithm**).
- **Detection & Recovery:** Allow deadlock to occur, detect via Resource Allocation Graph cycles, and recover via process termination or resource preemption.`,
      code_snippet: null,
      tags: 'OS, Deadlocks, Coffman Conditions, Bankers Algorithm',
      companies_linked: ['microsoft', 'oracle', 'amazon', 'cisco', 'ibm']
    },
    {
      question: 'Explain the OSI Model layers and what happens when you type https://www.google.com in a browser and press Enter.',
      topic: 'Computer Networks',
      subtopic: 'OSI Model & Web Architecture',
      difficulty: 'Medium',
      question_type: 'Technical Interview',
      source: 'Google, Amazon, Microsoft, Cisco, Adobe, Atlassian',
      interview_tip: 'Structure your answer chronologically: DNS Resolution -> TCP Handshake -> TLS Handshake -> HTTP Request/Response -> Browser DOM Rendering.',
      answer: `### Step-by-Step Flow: Typing a URL

1. **URL Parsing & DNS Resolution:**
   - Browser parses protocol (\`https\`), host (\`www.google.com\`), and port (\`443\`).
   - Checks browser cache -> OS cache -> Router cache -> ISP Recursive Resolver.
   - Resolver queries Root DNS -> TLD DNS (\`.com\`) -> Authoritative DNS to resolve the IP address (e.g. \`142.250.190.46\`).

2. **TCP 3-Way Handshake (Transport Layer):**
   - Client sends **SYN**.
   - Server responds with **SYN-ACK**.
   - Client sends **ACK** (Connection established).

3. **TLS/SSL Handshake (Security Layer):**
   - Client Hello (supported cipher suites) -> Server Hello + Digital Certificate.
   - Client verifies certificate against Root CA.
   - Symmetric session keys are negotiated (using Diffie-Hellman / RSA).

4. **HTTP Request & Response (Application Layer):**
   - Client sends \`GET / HTTP/2\` encrypted request.
   - Server processes request and returns HTML response with status \`200 OK\`.

5. **Browser Rendering Engine:**
   - Parses HTML to construct **DOM Tree**.
   - Parses CSS to construct **CSSOM Tree**.
   - Combines into **Render Tree**, computes Layout/Reflow, and Paints pixels on screen.`,
      code_snippet: null,
      tags: 'Computer Networks, DNS, TCP, HTTP, Browser Architecture',
      companies_linked: ['google', 'amazon', 'microsoft', 'cisco', 'adobe', 'atlassian']
    },
    // OOP & Web Dev
    {
      question: 'Explain the 4 Pillars of OOP (Encapsulation, Abstraction, Inheritance, Polymorphism) with real-world coding examples.',
      topic: 'OOP',
      subtopic: 'Object Oriented Principles',
      difficulty: 'Easy',
      question_type: 'Technical Interview',
      source: 'TCS, Infosys, Accenture, Amazon, Microsoft, Zoho',
      interview_tip: 'Use clear analogies (e.g. Car or Bank Account) and write clean class definitions with access modifiers.',
      answer: `### 1. Encapsulation (Data Hiding & Bundling)
Wrapping data (variables) and methods into a single unit (class), restricting direct external access using private/protected fields.
- *Example:* Bank account balance is private; updated only via validated \`deposit()\` and \`withdraw()\` methods.

### 2. Abstraction (Hiding Complexity)
Displaying only essential features to the user while hiding internal implementation details.
- *Example:* A car driver uses the steering wheel and brake pedal without needing to know internal combustion thermodynamics.

### 3. Inheritance (Reusability & Hierarchy)
Mechanism where a child/subclass inherits attributes and behaviors from a parent/superclass.
- *Example:* \`ElectricCar\` inherits from \`Vehicle\`.

### 4. Polymorphism (Many Forms)
Ability of a message/method to be processed in more than one form.
- **Compile-time (Method Overloading):** Same method name with different parameter signatures.
- **Runtime (Method Overriding):** Subclass provides a specific implementation of a method defined in its superclass.`,
      code_snippet: `// TypeScript / ES6 Demonstration
class Vehicle {
  constructor(public brand: string) {}
  startEngine(): string {
    return "Generic engine sound";
  }
}

class Tesla extends Vehicle {
  // Polymorphism (Method Overriding)
  startEngine(): string {
    return "Silent electric hum (0 to 60 in 2.3s)";
  }
}`,
      tags: 'OOP, Polymorphism, Inheritance, Encapsulation, Abstraction',
      companies_linked: ['tcs', 'infosys', 'accenture', 'amazon', 'microsoft', 'zoho']
    },
    {
      question: 'How does React Virtual DOM and the Reconciliation (Fiber) algorithm work?',
      topic: 'Web Development',
      subtopic: 'React',
      difficulty: 'Medium',
      question_type: 'Technical Interview',
      source: 'Amazon, Meta, Uber, Flipkart, Atlassian',
      interview_tip: 'Explain that the real DOM is slow to manipulate because it triggers expensive reflow/repaint. Virtual DOM is a lightweight JS tree kept in memory.',
      answer: `### Virtual DOM Core Concept:
The **Virtual DOM (VDOM)** is a lightweight JavaScript object representation of the real DOM tree kept in memory and synced with the actual DOM by a library like ReactDOM (**Reconciliation**).

### How It Works:
1. **Render Phase:** When state or props change, React creates a new Virtual DOM tree representing the updated UI.
2. **Diffing Algorithm:** React compares the new Virtual DOM tree with the previous Virtual DOM tree using an efficient heuristic $O(N)$ algorithm:
   - Two elements of different types produce different trees.
   - Developers hint at which child elements are stable across renders with a unique \`key\` prop.
3. **Commit Phase (Fiber Reconciler):** React calculates the minimal set of real DOM mutations (insertions, updates, deletions) and batches them to update the real DOM in one smooth pass.

### React Fiber Engine:
React 16+ introduced the **Fiber architecture**, enabling incremental rendering: breaking work into chunks, pausing, aborting, or reprioritizing updates based on user interaction (e.g. keeping animations at 60 FPS).`,
      code_snippet: `// Lightweight VDOM object concept
const vdomElement = {
  type: 'button',
  props: {
    className: 'btn-primary',
    onClick: () => handleClick(),
    children: 'Submit'
  }
};`,
      tags: 'React, Virtual DOM, Fiber, Frontend, JavaScript',
      companies_linked: ['amazon', 'meta', 'uber', 'flipkart', 'atlassian']
    },
    // HR & Behavioral
    {
      question: 'Tell me about a time you faced a serious technical conflict or disagreement in a team project. How did you resolve it?',
      topic: 'HR & Behavioral',
      subtopic: 'Conflict Resolution',
      difficulty: 'Medium',
      question_type: 'Behavioral & Leadership Round',
      source: 'Amazon, Google, Microsoft, Deloitte, Accenture',
      interview_tip: 'Strictly follow the STAR method (Situation, Task, Action, Result). Never badmouth teammates; focus on data-driven decision making and positive team outcomes.',
      answer: `### Sample Answer using STAR Framework:

- **Situation:** During our final year capstone project (a real-time collaborative code editor), our 4-person team was divided on database selection. Two members wanted MongoDB for rapid prototyping, while I and another teammate advocated for PostgreSQL because of relational user workspace permissions and transaction integrity.
- **Task:** As tech lead, my task was to resolve the deadlock quickly without delaying our sprint milestone or hurting team morale.
- **Action:** Instead of arguing theoretically, I proposed a 1-day proof-of-concept spike. I benchmarked both databases against our 3 most critical queries: user access permissions, concurrent session updates, and revision history. We compared query latency, schema migration complexity, and ACID rollback safety. I presented the metrics in a friendly team call.
- **Result:** The data clearly showed PostgreSQL gave us zero data corruption during simulated concurrent rollbacks. The team unanimously agreed on PostgreSQL. We delivered the project on time and scored the highest project grade in our department.`,
      code_snippet: null,
      tags: 'HR, Behavioral, STAR Method, Leadership, Teamwork',
      companies_linked: ['amazon', 'google', 'microsoft', 'deloitte', 'accenture']
    },
    {
      question: 'Why do you want to join our company, and where do you see yourself in 3 to 5 years?',
      topic: 'HR & Behavioral',
      subtopic: 'Career Goals',
      difficulty: 'Easy',
      question_type: 'HR Interview',
      source: 'All Companies (Amazon, Microsoft, TCS, Infosys, Deloitte, Google)',
      interview_tip: 'Mention specific products/initiatives of the company. Connect your personal learning journey with the company\'s engineering scale.',
      answer: `### Recommended Structure:
1. **Specific Admiration:** Mention a specific tech product, open source contribution, or engineering culture aspect of the company (e.g., AWS distributed systems, Google search scale, TCS global footprint).
2. **Skill Alignment:** Explain how your technical foundation (DSA, web development, cloud) matches their engineering opportunities.
3. **3-5 Year Vision:** State that in 3 years you aim to become a strong autonomous Software Engineer / Technical Specialist with end-to-end feature ownership, mentoring junior engineers, and contributing to core architectural decisions.`,
      code_snippet: null,
      tags: 'HR, Career Goals, Culture Fit, Aspirations',
      companies_linked: ['amazon', 'microsoft', 'tcs', 'infosys', 'deloitte', 'google']
    }
  ];

  // Insert questions and map to companies
  const companySlugToId = {};
  const allComps = await all(`SELECT id, slug FROM companies`);
  for (const c of allComps) {
    companySlugToId[c.slug] = c.id;
  }

  for (const q of questionsData) {
    const qRes = await run(
      `INSERT INTO questions (question, answer, topic, subtopic, difficulty, question_type, source, interview_tip, code_snippet, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        q.question,
        q.answer,
        q.topic,
        q.subtopic,
        q.difficulty,
        q.question_type,
        q.source,
        q.interview_tip,
        q.code_snippet,
        q.tags
      ]
    );

    const questionId = qRes.id;

    // Link to companies
    for (const slug of q.companies_linked) {
      const cId = companySlugToId[slug];
      if (cId) {
        const repCount = Math.floor(Math.random() * 25) + 5;
        const freqLabel = repCount > 18 ? 'Frequently Reported' : repCount > 10 ? 'Occasionally Reported' : 'Recently Reported';
        await run(
          `INSERT INTO company_questions (company_id, question_id, role_name, reported_year, frequency_label, report_count)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [cId, questionId, 'Software Engineer', 2026, freqLabel, repCount]
        );
      }
    }
  }

  // 4. Seed Coding Problems
  const codingProblems = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      topic: 'Arrays & Hashing',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
      examples: JSON.stringify([
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6, return [1, 2].' }
      ]),
      constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nOnly one valid answer exists.',
      starter_code: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      test_cases: JSON.stringify([
        { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { input: [[3, 2, 4], 6], expected: [1, 2] },
        { input: [[3, 3], 6], expected: [0, 1] }
      ]),
      solution_code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
      companies: 'Amazon, Google, Microsoft, Meta, Apple',
      hints: 'Can you use a Hash Map to check complements in O(1) time?'
    },
    {
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      difficulty: 'Easy',
      topic: 'Stack',
      description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Open brackets must be closed by the same type of brackets and in the correct order.',
      examples: JSON.stringify([
        { input: 's = "()"', output: 'true' },
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' }
      ]),
      constraints: '1 <= s.length <= 10^4\ns consists of parentheses only `()[]{}`.',
      starter_code: `function isValid(s) {
  // Write your solution here
  
}`,
      test_cases: JSON.stringify([
        { input: ['()'], expected: true },
        { input: ['()[]{}'], expected: true },
        { input: ['(]'], expected: false },
        { input: ['([)]'], expected: false },
        { input: ['{[]}'], expected: true }
      ]),
      solution_code: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (c === '(' || c === '{' || c === '[') stack.push(c);
    else {
      if (!stack.length || stack.pop() !== map[c]) return false;
    }
  }
  return stack.length === 0;
}`,
      companies: 'Amazon, TCS, Infosys, Microsoft, Zoho',
      hints: 'Use a stack to track opening brackets. Match them as you encounter closing brackets.'
    },
    {
      title: 'Best Time to Buy and Sell Stock',
      slug: 'best-time-to-buy-and-sell-stock',
      difficulty: 'Easy',
      topic: 'Arrays & Dynamic Programming',
      description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction.',
      examples: JSON.stringify([
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
        { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and max profit = 0.' }
      ]),
      constraints: '1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4',
      starter_code: `function maxProfit(prices) {
  // Write your solution here
  
}`,
      test_cases: JSON.stringify([
        { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
        { input: [[7, 6, 4, 3, 1]], expected: 0 },
        { input: [[2, 4, 1]], expected: 2 }
      ]),
      solution_code: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;
    else if (p - minPrice > maxProfit) maxProfit = p - minPrice;
  }
  return maxProfit;
}`,
      companies: 'Amazon, Microsoft, Google, Uber, Accenture',
      hints: 'Track the minimum buying price seen so far and update maximum profit at each step.'
    },
    {
      title: 'Merge Intervals',
      slug: 'merge-intervals',
      difficulty: 'Medium',
      topic: 'Intervals & Sorting',
      description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
      examples: JSON.stringify([
        { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
        { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' }
      ]),
      constraints: '1 <= intervals.length <= 10^4\nintervals[i].length == 2\n0 <= start_i <= end_i <= 10^4',
      starter_code: `function merge(intervals) {
  // Write your solution here
  
}`,
      test_cases: JSON.stringify([
        { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
        { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] }
      ]),
      solution_code: `function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }
  return result;
}`,
      companies: 'Amazon, Google, Microsoft, Meta, Salesforce',
      hints: 'Sort intervals by start time first, then iterate and merge if current interval overlaps with the last added interval.'
    }
  ];

  for (const prob of codingProblems) {
    await run(
      `INSERT INTO coding_problems (title, slug, difficulty, topic, description, examples, constraints, starter_code, test_cases, solution_code, companies, hints)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        prob.title,
        prob.slug,
        prob.difficulty,
        prob.topic,
        prob.description,
        prob.examples,
        prob.constraints,
        prob.starter_code,
        prob.test_cases,
        prob.solution_code,
        prob.companies,
        prob.hints
      ]
    );
  }

  // 5. Seed Interview Experiences
  const experiences = [
    {
      author_name: 'Ananya Sharma',
      college: 'VIT Vellore',
      company_slug: 'amazon',
      role_title: 'SDE-1 (Software Development Engineer)',
      year: 2026,
      difficulty: 'Hard',
      selection_result: 'Selected',
      rounds_data: JSON.stringify([
        {
          round_name: 'Online Assessment (OA)',
          details: '2 coding questions on HackerRank (1 Medium Tree problem + 1 Hard DP) + Work Style Assessment (Amazon 14 Leadership Principles simulation).'
        },
        {
          round_name: 'Technical Round 1',
          details: 'Live coding on Amazon Chime: Binary Tree Vertical Order Traversal + LRU Cache implementation with edge case analysis.'
        },
        {
          round_name: 'Technical Round 2',
          details: 'Low Level Design: Design a parking lot system with vehicle type pricing and concurrency handling. Followed by deep questions on OS multithreading.'
        },
        {
          round_name: 'Bar Raiser / Leadership Round',
          details: 'Senior Manager from US team. 45 minutes of in-depth behavioral scenarios on "Customer Obsession" and "Bias for Action" + 1 Graphs problem.'
        }
      ]),
      questions_summary: 'LRU Cache, Binary Tree Vertical Traversal, Parking Lot LLD, Amazon Leadership Principles.',
      additional_tips: 'Prepare 2 solid project stories for every single Amazon Leadership Principle using the STAR method. Code must compile without syntax issues.',
      status: 'approved'
    },
    {
      author_name: 'Rahul Verma',
      college: 'SRM Institute of Science and Technology',
      company_slug: 'tcs',
      role_title: 'TCS Prime (Software Developer)',
      year: 2026,
      difficulty: 'Medium',
      selection_result: 'Selected',
      rounds_data: JSON.stringify([
        {
          round_name: 'TCS NQT Advanced Section',
          details: 'Aptitude + Advanced Reasoning + 2 Coding Problems in Java (1 String manipulation, 1 Matrix rotation).'
        },
        {
          round_name: 'Technical Round (TR)',
          details: 'Panel of 2 interviewers. Questions on SQL Joins, 3NF Normalization, Indexing, and OOP Pillars with live Java code writing.'
        },
        {
          round_name: 'Managerial & HR Round',
          details: 'Discussion on final year project architecture, willingness to relocate, and career roadmap in cloud/AI.'
        }
      ]),
      questions_summary: 'SQL Joins, Normalization, OOP in Java, String Manipulation, Project Deep Dive.',
      additional_tips: 'Aim for TCS Prime/Digital by scoring above 85% in NQT advanced coding section. Be crisp and confident with core CS subjects.',
      status: 'approved'
    },
    {
      author_name: 'Pooja Iyer',
      college: 'BITS Pilani',
      company_slug: 'microsoft',
      role_title: 'Software Engineer',
      year: 2026,
      difficulty: 'Hard',
      selection_result: 'Selected',
      rounds_data: JSON.stringify([
        {
          round_name: 'Online Coding Test',
          details: '3 questions on Codility: String matching, Graph connected components, and Greedy interval scheduling.'
        },
        {
          round_name: 'Technical Round 1',
          details: 'In-depth discussion on Trie data structure for autocomplete suggestions + Reverse Linked List in groups of K.'
        },
        {
          round_name: 'Technical Round 2',
          details: 'System Design: Design a URL Shortener (TinyURL) with rate limiting, Redis caching, and database sharding strategy.'
        },
        {
          round_name: 'Director / Hiring Manager Round',
          details: 'Culture fit, growth mindset questions, and situational questions on handling production outages.'
        }
      ]),
      questions_summary: 'Trie Autocomplete, Reverse Nodes in K-Group, TinyURL System Design, OS Virtual Memory.',
      additional_tips: 'Focus heavily on code cleanliness and modular function decomposition. Discuss time/space trade-offs proactively.',
      status: 'approved'
    }
  ];

  for (const exp of experiences) {
    const cId = companySlugToId[exp.company_slug];
    if (cId) {
      await run(
        `INSERT INTO interview_experiences (user_id, author_name, college, company_id, role_title, year, difficulty, selection_result, rounds_data, questions_summary, additional_tips, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          1,
          exp.author_name,
          exp.college,
          cId,
          exp.role_title,
          exp.year,
          exp.difficulty,
          exp.selection_result,
          exp.rounds_data,
          exp.questions_summary,
          exp.additional_tips,
          exp.status
        ]
      );
    }
  }

  // 6. Seed Progress & Bookmarks for default student
  await run(
    `INSERT INTO bookmarks (user_id, item_type, item_id) VALUES (1, 'question', 1), (1, 'question', 3), (1, 'company', 1), (1, 'company', 2)`
  );

  await run(
    `INSERT INTO user_progress (user_id, item_type, item_id, status, score, topic) 
     VALUES (1, 'question', 1, 'completed', 100, 'DBMS'), 
            (1, 'question', 2, 'completed', 100, 'DBMS'),
            (1, 'question', 5, 'completed', 100, 'DSA'),
            (1, 'question', 6, 'completed', 100, 'DSA'),
            (1, 'question', 9, 'completed', 90, 'OOP')`
  );

  // 7. Seed Sample Placement Roadmap
  const sampleRoadmap = {
    title: '60-Day Full-Stack & Product SDE Master Roadmap',
    target_role: 'Software Development Engineer',
    target_companies: 'Amazon, Microsoft, Google, TCS Digital',
    duration_days: 60,
    current_level: 'Intermediate',
    weeks: [
      {
        week: 1,
        title: 'Core Programming & Data Structures Foundation',
        focus: 'Arrays, Strings, Two Pointers, Sliding Window, Time & Space Complexity',
        tasks: [
          { id: 'w1_1', title: 'Solve Two Sum, Best Time to Buy Stock, and 3Sum', completed: true },
          { id: 'w1_2', title: 'Master Sliding Window: Longest Substring Without Repeating Characters', completed: true },
          { id: 'w1_3', title: 'Practice Fast & Slow Pointers: Linked List Cycle Detection', completed: true },
          { id: 'w1_4', title: 'Review Time Complexity Analysis & Big-O Notation', completed: true }
        ]
      },
      {
        week: 2,
        title: 'Linear Data Structures & Recursion',
        focus: 'Stack, Queue, Monotonic Stack, Linked Lists, Recursion Backtracking',
        tasks: [
          { id: 'w2_1', title: 'Solve Valid Parentheses, Daily Temperatures (Monotonic Stack)', completed: true },
          { id: 'w2_2', title: 'Reverse a Linked List & Merge Two Sorted Lists', completed: true },
          { id: 'w2_3', title: 'Generate Parentheses and Subsets (Recursion Backtracking)', completed: false },
          { id: 'w2_4', title: 'Implement Queue using Stacks and LRU Cache concepts', completed: false }
        ]
      },
      {
        week: 3,
        title: 'Non-Linear Data Structures: Trees & Graphs',
        focus: 'Binary Trees, BST, Traversals (BFS/DFS), Graph Matrix/Adjacency List',
        tasks: [
          { id: 'w3_1', title: 'Tree Traversals: Inorder, Preorder, Postorder, Level-Order (BFS)', completed: false },
          { id: 'w3_2', title: 'Validate Binary Search Tree & Lowest Common Ancestor', completed: false },
          { id: 'w3_3', title: 'Number of Islands & Rotting Oranges (Matrix BFS/DFS)', completed: false },
          { id: 'w3_4', title: 'Dijkstra Shortest Path & Topological Sort fundamentals', completed: false }
        ]
      },
      {
        week: 4,
        title: 'Core CS Fundamentals: DBMS & SQL Mastery',
        focus: 'SQL Queries, Joins, Normalization (1NF to BCNF), Indexing, ACID & Transactions',
        tasks: [
          { id: 'w4_1', title: 'Solve Top 15 SQL queries (Nth Highest Salary, Joins, Group By)', completed: true },
          { id: 'w4_2', title: 'Deep dive into 1NF, 2NF, 3NF, BCNF with real schema tables', completed: true },
          { id: 'w4_3', title: 'Understand Clustered vs Non-Clustered Indexes and B-Tree structure', completed: false },
          { id: 'w4_4', title: 'Master ACID properties & transaction isolation levels', completed: false }
        ]
      },
      {
        week: 5,
        title: 'Operating Systems & Computer Networks',
        focus: 'Process vs Thread, Concurrency, Deadlocks, CPU Scheduling, OSI Layers, TCP/IP, DNS',
        tasks: [
          { id: 'w5_1', title: 'Study Process synchronization, Mutex vs Semaphore, Deadlock conditions', completed: false },
          { id: 'w5_2', title: 'Understand Virtual Memory, Paging, TLB, Page Faults', completed: false },
          { id: 'w5_3', title: 'Trace URL navigation: DNS -> TCP Handshake -> TLS -> HTTP/2 -> DOM', completed: false },
          { id: 'w5_4', title: 'Review TCP vs UDP and Socket Programming basics', completed: false }
        ]
      },
      {
        week: 6,
        title: 'Object Oriented Design & System Design Basics',
        focus: 'OOP 4 Pillars, SOLID Principles, Design Patterns, REST API Design, Caching',
        tasks: [
          { id: 'w6_1', title: 'Implement Low-Level Design for Parking Lot & LRU Cache', completed: false },
          { id: 'w6_2', title: 'Review SOLID principles with clean code refactoring examples', completed: false },
          { id: 'w6_3', title: 'Study High-Level Architecture: Load Balancers, Redis Caching, CDN', completed: false },
          { id: 'w6_4', title: 'Design URL Shortener (TinyURL) with capacity estimation', completed: false }
        ]
      },
      {
        week: 7,
        title: 'AI Mock Interviews & Resume Deep Dive',
        focus: 'Technical Mock Sessions, STAR behavioral questions, Resume project explanations',
        tasks: [
          { id: 'w7_1', title: 'Take 2 Full-length AI Mock Interviews on Target Companies', completed: false },
          { id: 'w7_2', title: 'Prepare 5 STAR format stories for Leadership & Conflict resolution', completed: false },
          { id: 'w7_3', title: 'Run Resume Analyzer and prepare answers for project architecture Qs', completed: false },
          { id: 'w7_4', title: 'Review Weak Areas identified in Placement Readiness Dashboard', completed: false }
        ]
      },
      {
        week: 8,
        title: 'Company-Specific Sprint & Speed Practice',
        focus: 'Target company past reported questions, timed coding tests, HR pitch',
        tasks: [
          { id: 'w8_1', title: 'Solve 20+ Frequently Reported questions for Amazon / TCS / Microsoft', completed: false },
          { id: 'w8_2', title: 'Complete 3 Timed Practice Quizzes (30 min speed tests)', completed: false },
          { id: 'w8_3', title: 'Finalize Elevator Pitch: "Tell me about yourself" & Career Goals', completed: false },
          { id: 'w8_4', title: 'Final Review of Bookmarked questions and cheat-sheets', completed: false }
        ]
      }
    ]
  };

  await run(
    `INSERT INTO roadmaps (user_id, title, target_role, target_companies, duration_days, current_level, structure)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      1,
      sampleRoadmap.title,
      sampleRoadmap.target_role,
      sampleRoadmap.target_companies,
      sampleRoadmap.duration_days,
      sampleRoadmap.current_level,
      JSON.stringify(sampleRoadmap.weeks)
    ]
  );

  console.log('Placement Guide Database successfully seeded with 20 companies, question bank, coding challenges, roadmaps, and users!');
};

// If run directly via node
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    console.log('Seed completed.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
