import { run, get, initDb } from './db.js';

const newTier1Companies = [
  {
    name: 'Goldman Sachs',
    slug: 'goldman-sachs',
    logo_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=128&auto=format&fit=crop&q=80',
    description: 'Global investment banking and financial services leader, known for engineering excellence in quantitative finance, algorithmic trading, and enterprise-scale distributed systems.',
    website: 'https://www.goldmansachs.com/careers',
    industry: 'Investment Banking / FinTech / Quantitative Engineering',
    difficulty: 'Hard',
    hiring_type: 'On-Campus / Goldman Sachs Engineering Campus Hiring',
    popular_roles: 'Software Engineer (Analyst - 25+ LPA), Quantitative Developer, Platform Engineer',
    eligibility: 'B.Tech/M.Tech in CS/IT/Math and Computing, 7.5+ CGPA, 0 active backlogs',
    interview_overview: 'Competitive DSA OA on HackerRank + Technical rounds covering Distributed Systems, Concurrency, Low Latency systems + Behavioral round.'
  },
  {
    name: 'JPMorgan Chase',
    slug: 'jpmorgan-chase',
    logo_url: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=128&auto=format&fit=crop&q=80',
    description: 'One of the world\'s largest financial institutions, investing heavily in cloud-native banking platforms, cybersecurity, AI, and blockchain technology.',
    website: 'https://careers.jpmorgan.com',
    industry: 'Banking Technology / FinTech / Cybersecurity',
    difficulty: 'Hard',
    hiring_type: 'Code for Good Hackathon / Campus Placements / Off-Campus',
    popular_roles: 'Software Engineer (Analyst - 18+ LPA), Data Analyst, Cloud Engineer',
    eligibility: 'B.Tech/M.Tech in CS/IT/ECE, Minimum 7.0 CGPA, No active backlogs',
    interview_overview: 'Online assessment (Aptitude + Coding) + Technical interview (DSA, OOPS, DBMS) + HR round. Code for Good winners get direct offers.'
  },
  {
    name: 'Netflix',
    slug: 'netflix',
    logo_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=128&auto=format&fit=crop&q=80',
    description: 'World leader in streaming entertainment with pioneering microservices architecture, chaos engineering, A/B testing at scale, and personalization ML systems.',
    website: 'https://jobs.netflix.com',
    industry: 'Streaming / Distributed Systems / ML',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Off-Campus / Referrals',
    popular_roles: 'Software Engineer (SWE - 50+ LPA), Data Engineer, Machine Learning Engineer',
    eligibility: 'B.S/B.Tech/M.S in CS with exceptional engineering background, 0 backlogs',
    interview_overview: 'Phone screen (DSA) + 4-5 rounds including System Design, Leadership & Culture fit, and Coding. Netflix pays top-of-market compensation.'
  },
  {
    name: 'LinkedIn',
    slug: 'linkedin',
    logo_url: 'https://images.unsplash.com/photo-1616469829167-0bd66b715541?w=128&auto=format&fit=crop&q=80',
    description: 'World\'s largest professional networking platform (Microsoft subsidiary) powering career development, B2B marketing, and recruiter intelligence at scale.',
    website: 'https://careers.linkedin.com',
    industry: 'Professional Networking / SaaS / AI',
    difficulty: 'Hard',
    hiring_type: 'LinkedIn REACH Apprenticeship / Campus Hiring / Off-Campus',
    popular_roles: 'Software Engineer (SWE - 35+ LPA), Data Scientist, Product Manager',
    eligibility: 'B.Tech/M.Tech in CS/IT or related, 7.0+ CGPA',
    interview_overview: 'Recruiter screen + Technical phone screen (DSA) + 5 virtual onsite rounds: 2x Coding, 1x System Design, 1x Behavioral, 1x Hiring Manager.'
  },
  {
    name: 'Twitter / X',
    slug: 'twitter-x',
    logo_url: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=128&auto=format&fit=crop&q=80',
    description: 'Global real-time public conversation platform and social network, evolving into X with financial services, creator monetization, and AI under Elon Musk\'s leadership.',
    website: 'https://careers.x.com',
    industry: 'Social Media / Real-time Systems / FinTech',
    difficulty: 'Hard',
    hiring_type: 'Campus Hiring / Off-Campus Careers Portal',
    popular_roles: 'Software Engineer (SWE - 40+ LPA), Site Reliability Engineer, ML Engineer',
    eligibility: 'B.Tech/M.Tech in CS/IT/Math, 7.5+ CGPA, strong open-source contributions preferred',
    interview_overview: 'Phone screen + 5 onsite rounds covering DSA, Real-time Systems Design, Distributed Computing, and Cultural alignment with speed & ownership values.'
  },
  {
    name: 'Stripe',
    slug: 'stripe',
    logo_url: 'https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?w=128&auto=format&fit=crop&q=80',
    description: 'Global payments infrastructure leader powering online commerce for millions of businesses — known for developer-first API design, financial reliability, and ML-powered fraud detection.',
    website: 'https://stripe.com/jobs',
    industry: 'Payments Infrastructure / FinTech / Developer Tools',
    difficulty: 'Hard',
    hiring_type: 'Campus Hiring / Off-Campus (Referral heavy)',
    popular_roles: 'Software Engineer (35-50 LPA), Infrastructure Engineer, Data Scientist',
    eligibility: 'B.Tech/M.Tech/MS in CS, strong open-source track record, exceptional coding ability',
    interview_overview: 'Technical phone screen + 4-5 onsite rounds: Coding (DSA), System Design, API Design, Infrastructure round, and Behavior/Values interview.'
  },
  {
    name: 'Airbnb',
    slug: 'airbnb',
    logo_url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=128&auto=format&fit=crop&q=80',
    description: 'Global online marketplace for short-term lodging and experiences, engineering massive-scale search, pricing algorithms, trust & safety systems, and data infrastructure.',
    website: 'https://careers.airbnb.com',
    industry: 'Travel Tech / Marketplace / Data Engineering',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Off-Campus Hiring',
    popular_roles: 'Software Engineer (SWE - 40+ LPA), Data Engineer, ML Engineer - Pricing',
    eligibility: 'B.S/B.Tech/M.S in CS or related STEM, 7.0+ CGPA',
    interview_overview: '2 Coding rounds (DSA - Trees, DP, Graphs) + 1 System Design + 1 Cross-functional interview focusing on Airbnb core values and experience.'
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    logo_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=128&auto=format&fit=crop&q=80',
    description: 'Global electronics and semiconductor powerhouse spanning consumer devices (Galaxy, QLED), chipsets (Exynos, HBM DRAM), and enterprise B2B cloud and AI solutions.',
    website: 'https://www.samsung.com/global/business/careers',
    industry: 'Semiconductors / Consumer Electronics / Cloud',
    difficulty: 'Medium-Hard',
    hiring_type: 'Samsung PRISM / Samsung Research India / On-Campus',
    popular_roles: 'Software Engineer - R&D (12-20 LPA), Hardware Engineer, AI Researcher',
    eligibility: 'B.Tech/M.Tech in CS/ECE/VLSI, Minimum 7.0 CGPA, No active backlogs',
    interview_overview: 'Written test (Aptitude + C/C++/DSA) + Technical rounds (C/C++, OS, Embedded Systems, OOPS) + HR round.'
  },
  {
    name: 'Qualcomm',
    slug: 'qualcomm',
    logo_url: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=128&auto=format&fit=crop&q=80',
    description: 'Global leader in semiconductor innovation — designing mobile chipsets (Snapdragon), 5G modems, AI edge processors, and automotive connectivity solutions.',
    website: 'https://www.qualcomm.com/company/careers',
    industry: 'Semiconductors / Wireless Technology / AI Edge',
    difficulty: 'Hard',
    hiring_type: 'Campus Placements / Qualcomm Innovate in India',
    popular_roles: 'Engineer - Software (20-28 LPA), VLSI Design Engineer, Firmware Engineer',
    eligibility: 'B.Tech/M.Tech in CS/ECE/VLSI, 7.5+ CGPA preferred',
    interview_overview: 'Aptitude + Technical test (C/C++, OS, Computer Architecture, Networking) + 3 Technical rounds + HR round. VLSI/ECE roles also test RTL/VHDL.'
  },
  {
    name: 'PayPal',
    slug: 'paypal',
    logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128&auto=format&fit=crop&q=80',
    description: 'Global digital payments platform processing trillions in transactions — engineering fraud detection ML, distributed ledger technology, and real-time payment infrastructure.',
    website: 'https://www.paypal.com/us/webapps/mpp/jobs',
    industry: 'Digital Payments / FinTech / Fraud Prevention',
    difficulty: 'Medium-Hard',
    hiring_type: 'Campus Recruitment / PayPal Cybersecurity Summit / Off-Campus',
    popular_roles: 'Software Engineer (SDE - 18-28 LPA), Data Science Engineer, Security Engineer',
    eligibility: 'B.Tech/M.Tech in CS/IT/ECE, Minimum 7.0 CGPA, 0 active backlogs',
    interview_overview: 'Online assessment (Aptitude + 2 Coding) + 2-3 Technical rounds (DSA, System Design, Backend Architecture) + HR behavioral round.'
  },
  {
    name: 'NVIDIA',
    slug: 'nvidia',
    logo_url: 'https://images.unsplash.com/photo-1591405351990-4726e331f141?w=128&auto=format&fit=crop&q=80',
    description: 'Computing company building accelerated platforms for graphics, artificial intelligence, autonomous systems, and high-performance computing.',
    website: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    industry: 'Semiconductors / AI / High-Performance Computing',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Internships / Experienced Hiring',
    popular_roles: 'Software Engineer, Deep Learning Engineer, GPU and Systems Engineer',
    eligibility: 'Role-dependent degree and experience requirements; strong programming and computer science fundamentals.',
    interview_overview: 'Interview loops vary by team and role, and may cover coding, algorithms, systems, GPU architecture, machine learning, and project experience.'
  },
  {
    name: 'Walmart Global Tech',
    slug: 'walmart-global-tech',
    logo_url: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=128&auto=format&fit=crop&q=80',
    description: 'Walmart technology organization building retail, supply-chain, e-commerce, payments, and data platforms used across global operations.',
    website: 'https://careers.walmart.com/technology',
    industry: 'Retail Technology / E-Commerce / Cloud',
    difficulty: 'Hard',
    hiring_type: 'Campus Hiring / Internships / Experienced Hiring',
    popular_roles: 'Software Engineer, Data Engineer, Site Reliability Engineer',
    eligibility: 'Role-dependent degree and experience requirements; software roles typically expect programming and data structures fundamentals.',
    interview_overview: 'The process varies by role and location and commonly includes coding, technical discussions, project experience, and behavioral interviews.'
  },
  {
    name: 'ServiceNow',
    slug: 'servicenow',
    logo_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80',
    description: 'Enterprise cloud platform company helping organizations automate digital workflows, IT operations, customer service, and employee experiences.',
    website: 'https://careers.servicenow.com/',
    industry: 'Enterprise SaaS / Cloud / Workflow Automation',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Internships / Experienced Hiring',
    popular_roles: 'Software Engineer, Platform Engineer, Machine Learning Engineer',
    eligibility: 'Role-dependent degree and experience requirements; software roles expect strong programming fundamentals.',
    interview_overview: 'Interview stages vary by role and may include coding, data structures, system design, technical project discussions, and behavioral interviews.'
  },
  {
    name: 'Intuit',
    slug: 'intuit',
    logo_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=128&auto=format&fit=crop&q=80',
    description: 'Financial technology company behind products including TurboTax, QuickBooks, Credit Karma, and Mailchimp, with a focus on AI-powered financial tools.',
    website: 'https://careers.intuit.com/',
    industry: 'Financial Technology / SaaS / AI',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Internships / Experienced Hiring',
    popular_roles: 'Software Engineer, Data Scientist, Security Engineer',
    eligibility: 'Role-dependent degree and experience requirements; software roles typically require programming and problem-solving skills.',
    interview_overview: 'The process varies by team and may include coding, technical and design discussions, project experience, and behavioral interviews.'
  },
  {
    name: 'Bloomberg',
    slug: 'bloomberg',
    logo_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=128&auto=format&fit=crop&q=80',
    description: 'Global financial data and technology company delivering market information, analytics, and software to financial professionals.',
    website: 'https://www.bloomberg.com/company/careers/',
    industry: 'Financial Data / Software / Media',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Internships / Experienced Hiring',
    popular_roles: 'Software Engineer, Data Engineer, Quantitative Developer',
    eligibility: 'Role-dependent degree and experience requirements; engineering candidates should be ready to discuss coding and computer science fundamentals.',
    interview_overview: 'Interview loops vary by role and may include coding, algorithms, system design, technical projects, and behavioral discussions.'
  },
  {
    name: 'Databricks',
    slug: 'databricks',
    logo_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128&auto=format&fit=crop&q=80',
    description: 'Data and AI platform company building tools for data engineering, analytics, machine learning, and large-scale lakehouse architectures.',
    website: 'https://www.databricks.com/company/careers',
    industry: 'Data Platforms / Cloud / AI',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Internships / Experienced Hiring',
    popular_roles: 'Software Engineer, Data Engineer, Machine Learning Engineer',
    eligibility: 'Role-dependent degree and experience requirements; strong coding and distributed data systems skills are relevant for engineering roles.',
    interview_overview: 'Interview stages differ by team and may cover coding, algorithms, distributed systems, data processing, and role-specific technical experience.'
  },
  {
    name: 'Snowflake',
    slug: 'snowflake',
    logo_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=128&auto=format&fit=crop&q=80',
    description: 'Cloud data platform company providing data warehousing, analytics, application development, and AI capabilities across major cloud providers.',
    website: 'https://careers.snowflake.com/',
    industry: 'Cloud Data / Analytics / AI',
    difficulty: 'Hard',
    hiring_type: 'University Recruiting / Internships / Experienced Hiring',
    popular_roles: 'Software Engineer, Database Engineer, Data Scientist',
    eligibility: 'Role-dependent degree and experience requirements; engineering roles value programming, databases, and distributed systems knowledge.',
    interview_overview: 'The process varies by role and may include coding, data structures, databases, system design, and technical or behavioral discussions.'
  }
];

const rounds = [
  {
    name: 'Round 1: Online Assessment (OA)',
    description: 'Automated test evaluating aptitude, CS fundamentals, and 2-3 algorithmic coding problems on platforms like HackerRank or Codility.',
    typical_topics: 'Data Structures, Aptitude, Speed Coding, Time Complexity Analysis',
    question_types: 'MCQ & Online Coding',
    preparation_tips: 'Focus on speed, write modular code, and test edge cases like empty arrays and large inputs. Practice on LeetCode Medium daily.',
    order_number: 1
  },
  {
    name: 'Round 2: Technical Interview - DSA & Core CS',
    description: '1-on-1 live coding session focusing on problem solving, trees, graphs, strings, DBMS, and OS concepts.',
    typical_topics: 'Trees, Graphs, Dynamic Programming, SQL Queries, OS Concurrency, OOP Principles',
    question_types: 'Live Coding & Deep CS Q&A',
    preparation_tips: 'Speak your thought process aloud before writing code. Analyze time and space complexity clearly. Aim for optimal solutions.',
    order_number: 2
  },
  {
    name: 'Round 3: Technical Interview - Projects & System Design',
    description: 'Detailed walkthrough of resume projects, architecture trade-offs, API design, scalability patterns, and DB schema discussions.',
    typical_topics: 'Project Architecture, REST APIs, Caching, Database Indexing, Load Balancing, CAP Theorem',
    question_types: 'System Design & Code Walkthrough',
    preparation_tips: 'Know every line of code on your resume. Be ready to explain why you chose a specific database or framework vs alternatives.',
    order_number: 3
  },
  {
    name: 'Round 4: Managerial / Behavioral & HR',
    description: 'Evaluation of team collaboration, conflict resolution, cultural alignment, leadership, and career growth motivations.',
    typical_topics: 'Conflict Resolution, Ownership, Adaptability, Cross-team Collaboration, STAR Method Stories',
    question_types: 'Behavioral & Situational Questions',
    preparation_tips: 'Use the STAR (Situation, Task, Action, Result) format for every behavioral answer. Research company values and culture beforehand.',
    order_number: 4
  }
];

const insertCompanies = async () => {
  await initDb();
  console.log(`\nAdding ${newTier1Companies.length} Tier 1 companies...\n`);

  for (const comp of newTier1Companies) {
    // Check if company already exists
    const existing = await get(`SELECT id FROM companies WHERE slug = ?`, [comp.slug]);
    if (existing) {
      console.log(`⚠️  Skipping "${comp.name}" — already exists.`);
      continue;
    }

    const res = await run(
      `INSERT INTO companies (name, slug, logo_url, description, website, industry, difficulty, hiring_type, popular_roles, eligibility, interview_overview)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comp.name, comp.slug, comp.logo_url, comp.description, comp.website,
        comp.industry, comp.difficulty, comp.hiring_type, comp.popular_roles,
        comp.eligibility, comp.interview_overview
      ]
    );

    const compId = res.id;

    for (const r of rounds) {
      const diff = comp.difficulty === 'Hard' && r.order_number === 1 ? 'Medium-Hard' : comp.difficulty;
      await run(
        `INSERT INTO rounds (company_id, name, description, typical_topics, question_types, difficulty, preparation_tips, order_number)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [compId, r.name, r.description, r.typical_topics, r.question_types, diff, r.preparation_tips, r.order_number]
      );
    }

    console.log(`✅ Added: ${comp.name} (ID: ${compId}) with ${rounds.length} interview rounds`);
  }

  console.log('\n🎉 Done! All Tier 1 companies inserted successfully.\n');
  process.exit(0);
};

insertCompanies().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
