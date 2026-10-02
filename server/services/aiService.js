/**
 * AI Service for Placement Guide
 * Provides intelligent evaluation for mock interviews, resume-based questions,
 * and personalized roadmap generation with support for OpenAI API / heuristic fallback.
 */

export const evaluateMockAnswer = async ({
  question,
  userAnswer,
  topic,
  difficulty,
  companyName,
  roleName
}) => {
  // If user provides OPENAI_API_KEY, can make real OpenAI call
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an expert technical interviewer evaluating a student's answer for ${companyName || 'Top Tech'} for the role of ${roleName || 'Software Engineer'}.
Respond in strict JSON format with the following keys:
{
  "conceptAccuracy": number (0-100),
  "communicationScore": number (0-100),
  "completenessScore": number (0-100),
  "technicalDepth": number (0-100),
  "problemSolving": number (0-100),
  "overallScore": number (0-100),
  "strengths": string[],
  "weakAreas": string[],
  "improvementSuggestions": string[],
  "idealAnswerSummary": string,
  "recommendedTopics": string[],
  "followUpQuestion": string
}`
            },
            {
              role: 'user',
              content: `Question: ${question}\nTopic: ${topic}\nDifficulty: ${difficulty}\nCandidate Answer: ${userAnswer}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        return parsed;
      }
    } catch (err) {
      console.warn('OpenAI call failed, using intelligent heuristic evaluation engine:', err.message);
    }
  }

  // Intelligent Heuristic Evaluation Engine
  const answerLen = (userAnswer || '').trim().length;
  const wordCount = (userAnswer || '').trim().split(/\s+/).filter(Boolean).length;
  const lowerAnswer = (userAnswer || '').toLowerCase();
  
  // Topic keywords detection
  const keywordBank = {
    'DBMS': ['acid', 'atomicity', 'consistency', 'isolation', 'durability', '1nf', '2nf', '3nf', 'bcnf', 'primary key', 'foreign key', 'index', 'b-tree', 'normalization', 'redundancy', 'transaction', 'query'],
    'SQL': ['select', 'join', 'group by', 'order by', 'dense_rank', 'having', 'aggregate', 'index', 'subquery', 'where', 'partition', 'over'],
    'DSA': ['time complexity', 'space complexity', 'o(n)', 'o(1)', 'o(log n)', 'hash map', 'array', 'pointer', 'stack', 'queue', 'recursion', 'traversal', 'tree', 'graph', 'dp', 'sliding window'],
    'Operating Systems': ['process', 'thread', 'context switch', 'mutex', 'semaphore', 'deadlock', 'virtual memory', 'paging', 'tlb', 'scheduling', 'cpu', 'memory', 'concurrency'],
    'Computer Networks': ['tcp', 'udp', 'ip', 'dns', 'http', 'https', 'tls', 'handshake', 'osi', 'router', 'packet', 'latency', 'socket'],
    'OOP': ['encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'class', 'object', 'interface', 'overriding', 'overloading', 'solid'],
    'Web Development': ['react', 'virtual dom', 'fiber', 'state', 'props', 'hook', 'useeffect', 'usestate', 'api', 'async', 'await', 'rest', 'dom'],
    'HR & Behavioral': ['situation', 'task', 'action', 'result', 'team', 'challenge', 'resolved', 'learned', 'goal', 'leadership', 'collaboration', 'customer', 'ownership']
  };

  const currentTopicKeywords = keywordBank[topic] || keywordBank['DSA'];
  let matchedKeywords = currentTopicKeywords.filter(kw => lowerAnswer.includes(kw));

  // Determine scores based on quality metrics
  let conceptAccuracy = 50;
  let communicationScore = 60;
  let completenessScore = 55;
  let technicalDepth = 50;
  let problemSolving = 55;

  if (wordCount < 10) {
    conceptAccuracy = 30;
    communicationScore = 35;
    completenessScore = 25;
    technicalDepth = 20;
    problemSolving = 30;
  } else if (wordCount < 30) {
    conceptAccuracy = Math.min(65, 45 + matchedKeywords.length * 6);
    communicationScore = 60;
    completenessScore = 50;
    technicalDepth = 45;
    problemSolving = 50;
  } else {
    conceptAccuracy = Math.min(96, 65 + matchedKeywords.length * 7);
    communicationScore = Math.min(94, 70 + Math.min(20, wordCount / 5));
    completenessScore = Math.min(92, 60 + matchedKeywords.length * 8);
    technicalDepth = Math.min(95, 55 + matchedKeywords.length * 9);
    problemSolving = Math.min(92, 65 + matchedKeywords.length * 6);
  }

  const overallScore = Math.round(
    (conceptAccuracy * 0.3) +
    (technicalDepth * 0.25) +
    (completenessScore * 0.2) +
    (communicationScore * 0.15) +
    (problemSolving * 0.1)
  );

  const strengths = [];
  const weakAreas = [];
  const improvementSuggestions = [];

  if (matchedKeywords.length >= 2) {
    strengths.push(`Identified core domain concepts (${matchedKeywords.slice(0, 3).join(', ')}).`);
  }
  if (wordCount >= 40) {
    strengths.push('Articulated an elaborate response with good structural pacing.');
  } else {
    weakAreas.push('Response is brief; interviewer may seek more depth or edge case explanation.');
    improvementSuggestions.push('Elaborate on real-world practical tradeoffs and concrete code/schema examples.');
  }

  if (matchedKeywords.length === 0 && wordCount >= 15) {
    weakAreas.push(`Missing key terminology expected in ${topic} interviews.`);
    improvementSuggestions.push(`Mention standard industry terms such as ${currentTopicKeywords.slice(0, 3).join(', ')}.`);
  }

  if (overallScore >= 75) {
    strengths.push('Strong foundational grasp and clear interview-readiness demonstrated.');
    improvementSuggestions.push('Proactively mention time/space complexity or system scaling implications.');
  } else {
    improvementSuggestions.push('Structure your answer with: 1. Core definition, 2. Practical example, 3. Trade-offs / Edge cases.');
  }

  return {
    conceptAccuracy,
    communicationScore,
    completenessScore,
    technicalDepth,
    problemSolving,
    overallScore,
    strengths: strengths.length ? strengths : ['Good initial attempt to answer under interview conditions.'],
    weakAreas: weakAreas.length ? weakAreas : ['Could highlight more boundary conditions and scale constraints.'],
    improvementSuggestions: improvementSuggestions,
    idealAnswerSummary: `A comprehensive answer should explicitly define the core concept, provide a crisp code/table schema illustration, analyze trade-offs, and state relevant edge-cases.`,
    recommendedTopics: [topic, 'Time & Space Complexity', 'System Scalability'],
    followUpQuestion: `How would you handle this scenario at scale with millions of concurrent requests?`
  };
};

export const generateResumeQuestions = async ({
  resumeText,
  targetCompany,
  targetRole
}) => {
  const text = (resumeText || '').toLowerCase();
  
  // Extract detected tech stack
  const techMap = {
    'react': 'React.js & Frontend Architecture',
    'node': 'Node.js & Backend Event Loop',
    'express': 'RESTful API Design & Express Middleware',
    'python': 'Python & Data Processing',
    'java': 'Java Core & Spring Boot',
    'sql': 'SQL Optimization & Indexing',
    'mongodb': 'MongoDB NoSQL & Document Modeling',
    'postgresql': 'PostgreSQL & Relational Schemas',
    'docker': 'Docker & Containerization',
    'aws': 'AWS Cloud Services & S3/EC2/Lambda',
    'redis': 'Redis In-Memory Caching & Session Storage',
    'typescript': 'TypeScript Type Safety & Generics',
    'graphql': 'GraphQL Queries & Schema Design',
    'kafka': 'Apache Kafka & Event Streaming',
    'machine learning': 'ML Pipelines & Model Evaluation'
  };

  const detectedTech = Object.keys(techMap).filter(k => text.includes(k));
  const detectedProjects = [];

  if (text.includes('e-commerce') || text.includes('shop') || text.includes('cart')) {
    detectedProjects.push({
      name: 'E-Commerce Marketplace',
      questions: [
        'How did you handle concurrent inventory updates when multiple users purchase the last available item simultaneously?',
        'Explain your payment gateway integration and how you ensure idempotent webhook transactions.',
        'Why did you choose your specific database schema for product catalog vs user orders?'
      ]
    });
  }

  if (text.includes('chat') || text.includes('social') || text.includes('realtime') || text.includes('socket')) {
    detectedProjects.push({
      name: 'Real-Time Communication / Social App',
      questions: [
        'How do WebSockets differ from HTTP Long Polling, and how does your server handle 10,000 active socket connections?',
        'How do you manage message delivery guarantees (at-least-once) and offline notifications?',
        'What data structure did you use for managing user presence (online/offline status)?'
      ]
    });
  }

  if (text.includes('auth') || text.includes('jwt') || text.includes('security')) {
    detectedProjects.push({
      name: 'Authentication & Security Subsystem',
      questions: [
        'Where do you store JWT tokens on the frontend, and how do you protect against XSS and CSRF attacks?',
        'Explain how refresh tokens and token blacklisting/revocation work in your architecture.',
        'How do you store and hash passwords securely in the database?'
      ]
    });
  }

  // Fallback project if none matched
  if (detectedProjects.length === 0) {
    detectedProjects.push({
      name: 'Full-Stack Web Application',
      questions: [
        'Explain your end-to-end project architecture from client request to database query response.',
        'What was the most difficult technical bottleneck you encountered, and how did you resolve it?',
        'How would you scale this application to support 100,000 daily active users?'
      ]
    });
  }

  const generatedQuestions = [
    {
      category: 'Project Deep-Dive',
      project: detectedProjects[0].name,
      questions: detectedProjects[0].questions
    },
    {
      category: 'Technical Stack & Frameworks',
      skills: detectedTech.length ? detectedTech.map(t => techMap[t]) : ['React', 'Node.js', 'SQL', 'Git'],
      questions: [
        'Why did you choose this tech stack over alternative frameworks for your projects?',
        'How do you handle error logging, performance monitoring, and rate limiting in your backend services?',
        'Explain your strategy for automated unit and integration testing.'
      ]
    },
    {
      category: `Target Company Fit (${targetCompany || 'Top Tech'})`,
      questions: [
        `How do your resume projects demonstrate the engineering principles valued at ${targetCompany || 'leading tech companies'}?`,
        'Describe a time you had to optimize an API endpoint or slow database query based on performance metrics.',
        'If you had 2 more weeks to work on your primary project, what architectural improvements would you implement first?'
      ]
    }
  ];

  return {
    detectedSkills: detectedTech.length ? detectedTech.map(t => techMap[t]) : ['Full Stack JavaScript', 'SQL Database', 'REST APIs', 'Git'],
    detectedProjectsCount: detectedProjects.length,
    generatedQuestions,
    tips: [
      'Be prepared to write code on a whiteboard/live editor for any feature listed on your resume.',
      'Quantify your impact (e.g. "reduced latency by 35%", "handled 5,000 requests/sec").',
      'Never list a technology on your resume if you cannot explain its internal architecture.'
    ]
  };
};

export const generatePlacementRoadmap = ({
  targetRole = 'Software Development Engineer',
  targetCompanies = 'Amazon, Microsoft, TCS, Infosys',
  durationDays = 60,
  currentLevel = 'Intermediate',
  skills = ''
}) => {
  const weeksCount = Math.max(4, Math.round(durationDays / 7));
  const weeks = [];

  const roadmapTemplates = [
    {
      week: 1,
      title: 'Data Structures Foundation & Algorithm Analysis',
      focus: 'Arrays, Strings, Two Pointers, Sliding Window, Big-O Complexity',
      tasks: [
        { id: `w1_1`, title: 'Solve Two Sum, 3Sum, and Best Time to Buy Stock', completed: false },
        { id: `w1_2`, title: 'Master Sliding Window: Longest Substring Without Repeating Characters', completed: false },
        { id: `w1_3`, title: 'Practice Fast & Slow Pointers (Linked List Cycle)', completed: false },
        { id: `w1_4`, title: 'Review Time/Space Complexity for standard algorithms', completed: false }
      ]
    },
    {
      week: 2,
      title: 'Stacks, Queues, Linked Lists & Recursion',
      focus: 'Stack applications, Monotonic Stack, Linked List Reversal, Backtracking',
      tasks: [
        { id: `w2_1`, title: 'Solve Valid Parentheses and Min Stack', completed: false },
        { id: `w2_2`, title: 'Reverse a Linked List & Merge Two Sorted Lists', completed: false },
        { id: `w2_3`, title: 'Implement LRU Cache data structure', completed: false },
        { id: `w2_4`, title: 'Practice recursion: Subsets, Permutations, and Combinations', completed: false }
      ]
    },
    {
      week: 3,
      title: 'Trees, Binary Search Trees & Heaps',
      focus: 'Tree Traversals (BFS/DFS), BST Validation, Priority Queues / Top-K',
      tasks: [
        { id: `w3_1`, title: 'Tree Traversals: Inorder, Preorder, Postorder, Level-Order', completed: false },
        { id: `w3_2`, title: 'Validate BST and Lowest Common Ancestor (LCA)', completed: false },
        { id: `w3_3`, title: 'Find Kth Largest Element in an Array (Min-Heap)', completed: false },
        { id: `w3_4`, title: 'Binary Tree Maximum Path Sum', completed: false }
      ]
    },
    {
      week: 4,
      title: 'Graphs, BFS/DFS & Matrix Traversals',
      focus: 'Adjacency Lists, Number of Islands, Rotting Oranges, Shortest Path',
      tasks: [
        { id: `w4_1`, title: 'Solve Number of Islands (Grid DFS/BFS)', completed: false },
        { id: `w4_2`, title: 'Implement Course Schedule (Topological Sort / Cycle Detection)', completed: false },
        { id: `w4_3`, title: 'Dijkstra Shortest Path Algorithm practice', completed: false },
        { id: `w4_4`, title: 'Review Graph Representations and Clone Graph', completed: false }
      ]
    },
    {
      week: 5,
      title: 'DBMS, SQL Queries & Database Internals',
      focus: 'SQL Joins, Normalization (1NF to BCNF), Indexing, ACID & Transactions',
      tasks: [
        { id: `w5_1`, title: 'Solve Nth Highest Salary and Employee Department Joins', completed: false },
        { id: `w5_2`, title: 'Understand 1NF, 2NF, 3NF, BCNF anomalies & decompositions', completed: false },
        { id: `w5_3`, title: 'Clustered vs Non-Clustered Indexes and B+ Trees', completed: false },
        { id: `w5_4`, title: 'ACID Properties and Isolation Levels (Dirty Read, Non-repeatable read)', completed: false }
      ]
    },
    {
      week: 6,
      title: 'Operating Systems & Computer Networks',
      focus: 'Processes vs Threads, Concurrency, Deadlocks, OSI Model, TCP 3-Way Handshake',
      tasks: [
        { id: `w6_1`, title: 'Study Process vs Thread, Context Switching, IPC mechanisms', completed: false },
        { id: `w6_2`, title: 'Understand Deadlock Coffman Conditions & Banker\'s Algorithm', completed: false },
        { id: `w6_3`, title: 'Trace URL navigation: DNS -> TCP -> TLS -> HTTP/2 -> Render Tree', completed: false },
        { id: `w6_4`, title: 'Compare TCP vs UDP, Subnetting, and HTTP status codes', completed: false }
      ]
    },
    {
      week: 7,
      title: 'Low-Level Design, OOP & Project Deep Dive',
      focus: 'OOP 4 Pillars, SOLID Principles, Design Patterns, Resume Projects',
      tasks: [
        { id: `w7_1`, title: 'Implement LLD for Parking Lot or Elevator System in Java/JS', completed: false },
        { id: `w7_2`, title: 'Master SOLID principles with clean code refactoring', completed: false },
        { id: `w7_3`, title: 'Run Resume Analyzer and prepare answers for project architecture Qs', completed: false },
        { id: `w7_4`, title: 'Prepare 5 STAR stories for behavioral & leadership rounds', completed: false }
      ]
    },
    {
      week: 8,
      title: 'Company Sprints & AI Mock Interviews',
      focus: `Past reported questions for ${targetCompanies}, full mock interviews, speed drills`,
      tasks: [
        { id: `w8_1`, title: `Complete 20+ Frequently Reported questions for ${targetCompanies}`, completed: false },
        { id: `w8_2`, title: 'Take 3 Full-Length AI Mock Technical & HR Interviews', completed: false },
        { id: `w8_3`, title: 'Review Weak Areas on Placement Readiness Dashboard', completed: false },
        { id: `w8_4`, title: 'Final speed revision of formulas, SQL cheat-sheet & bookmarks', completed: false }
      ]
    }
  ];

  for (let i = 0; i < weeksCount; i++) {
    if (roadmapTemplates[i]) {
      weeks.push(roadmapTemplates[i]);
    } else {
      weeks.push({
        week: i + 1,
        title: `Advanced Revision & Mock Drill Sprint ${i + 1}`,
        focus: 'High-frequency algorithmic challenges and timed company assessments',
        tasks: [
          { id: `w${i+1}_1`, title: 'Solve 10 mixed Medium/Hard questions', completed: false },
          { id: `w${i+1}_2`, title: 'Take a timed 45-minute AI Mock Interview', completed: false },
          { id: `w${i+1}_3`, title: 'Review bookmarked tricky problems', completed: false }
        ]
      });
    }
  }

  return {
    title: `${durationDays}-Day Personalized Placement Roadmap for ${targetRole}`,
    target_role: targetRole,
    target_companies: targetCompanies,
    duration_days: durationDays,
    current_level: currentLevel,
    weeks
  };
};
