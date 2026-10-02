const API_BASE = '/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
  college?: string;
  degree?: string;
  branch?: string;
  graduation_year?: number;
  target_role?: string;
  target_companies?: string;
  skills?: string;
  preparation_level?: string;
  created_at?: string;
}

export interface Company {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  website: string;
  industry: string;
  difficulty: string;
  hiring_type: string;
  popular_roles: string;
  eligibility: string;
  interview_overview: string;
  question_count?: number;
  experience_count?: number;
  round_count?: number;
}

export interface Round {
  id: number;
  company_id: number;
  name: string;
  description: string;
  typical_topics: string;
  question_types: string;
  difficulty: string;
  preparation_tips: string;
  order_number: number;
}

export interface Question {
  id: number;
  question: string;
  answer: string;
  topic: string;
  subtopic?: string;
  difficulty: string;
  question_type: string;
  source: string;
  interview_tip?: string;
  code_snippet?: string;
  tags?: string;
  companies?: string[];
  company_slugs?: string[];
  frequency_label?: string;
  max_report_count?: number;
  is_bookmarked?: boolean;
  progress_status?: string | null;
  linked_companies?: Array<{
    id: number;
    name: string;
    slug: string;
    logo_url: string;
    role_name: string;
    reported_year: number;
    frequency_label: string;
    report_count: number;
  }>;
  related_questions?: Array<{
    id: number;
    question: string;
    topic: string;
    difficulty: string;
    question_type: string;
  }>;
}

export interface InterviewExperience {
  id: number;
  user_id?: number;
  author_name: string;
  college?: string;
  company_id: number;
  company_name?: string;
  company_slug?: string;
  company_logo?: string;
  role_title: string;
  year: number;
  difficulty: string;
  selection_result: string;
  rounds_data: Array<{
    round_name: string;
    details: string;
  }>;
  questions_summary?: string;
  additional_tips?: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at?: string;
}

export interface CodingProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  topic: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints?: string;
  starter_code: string;
  test_cases: Array<{ input: any; expected: any }>;
  solution_code?: string;
  companies?: string;
  hints?: string;
}

const getHeaders = () => {
  const token = localStorage.getItem('pg_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  register: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  login: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  demoLogin: async (role: 'student' | 'admin') => {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    });
    return res.json();
  },
  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    return res.json();
  },
  updateProfile: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Companies
  getCompanies: async (params: { search?: string; difficulty?: string; industry?: string } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.set(key, value);
    });
    const query = queryParams.toString();
    const res = await fetch(`${API_BASE}/companies?${query}`, { headers: getHeaders() });
    return res.json();
  },
  getCompanyDetails: async (slug: string) => {
    const res = await fetch(`${API_BASE}/companies/${slug}`, { headers: getHeaders() });
    return res.json();
  },
  createCompany: async (data: any) => {
    const res = await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateCompany: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE}/companies/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteCompany: async (id: number) => {
    const res = await fetch(`${API_BASE}/companies/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Questions
  getQuestions: async (params: { topic?: string; company?: string; difficulty?: string; search?: string; frequency?: string; questionType?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/questions?${query}`, { headers: getHeaders() });
    return res.json();
  },
  getQuestionDetails: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/questions/${id}`, { headers: getHeaders() });
    return res.json();
  },
  toggleQuestionProgress: async (id: number) => {
    const res = await fetch(`${API_BASE}/questions/${id}/toggle-progress`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },
  createQuestion: async (data: any) => {
    const res = await fetch(`${API_BASE}/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateQuestion: async (id: number, data: any) => {
    const res = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  deleteQuestion: async (id: number) => {
    const res = await fetch(`${API_BASE}/questions/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Interview Experiences
  getExperiences: async (params: { company?: string; search?: string; difficulty?: string; result?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/experiences?${query}`, { headers: getHeaders() });
    return res.json();
  },
  getExperienceDetails: async (id: number | string) => {
    const res = await fetch(`${API_BASE}/experiences/${id}`, { headers: getHeaders() });
    return res.json();
  },
  submitExperience: async (data: any) => {
    const res = await fetch(`${API_BASE}/experiences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  updateExperienceStatus: async (id: number, status: string) => {
    const res = await fetch(`${API_BASE}/experiences/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Practice & Coding
  getPracticeQuiz: async (params: { topic?: string; difficulty?: string; count?: number; company?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/practice/quiz?${query}`, { headers: getHeaders() });
    return res.json();
  },
  submitPracticeQuiz: async (data: any) => {
    const res = await fetch(`${API_BASE}/practice/quiz/submit`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getCodingProblems: async (params: { topic?: string; difficulty?: string; search?: string } = {}) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/practice/coding?${query}`, { headers: getHeaders() });
    return res.json();
  },
  getCodingProblemDetails: async (slug: string) => {
    const res = await fetch(`${API_BASE}/practice/coding/${slug}`, { headers: getHeaders() });
    return res.json();
  },
  runCode: async (data: { code: string; problem_id: number; language?: string }) => {
    const res = await fetch(`${API_BASE}/practice/coding/run`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // AI Mock Interview
  startMockInterview: async (data: { companyName?: string; roleName?: string; interviewType?: string; difficulty?: string; questionCount?: number }) => {
    const res = await fetch(`${API_BASE}/mock-interview/start`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  evaluateMockAnswer: async (data: { question: string; userAnswer: string; topic?: string; difficulty?: string; companyName?: string; roleName?: string }) => {
    const res = await fetch(`${API_BASE}/mock-interview/evaluate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  finishMockInterview: async (data: any) => {
    const res = await fetch(`${API_BASE}/mock-interview/finish`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  getMockHistory: async () => {
    const res = await fetch(`${API_BASE}/mock-interview/history`, { headers: getHeaders() });
    return res.json();
  },

  // Roadmaps
  getRoadmaps: async () => {
    const res = await fetch(`${API_BASE}/roadmaps`, { headers: getHeaders() });
    return res.json();
  },
  generateRoadmap: async (data: { targetRole: string; targetCompanies: string; durationDays: number; currentLevel: string; skills?: string }) => {
    const res = await fetch(`${API_BASE}/roadmaps/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  toggleRoadmapTask: async (roadmapId: number, taskId: string) => {
    const res = await fetch(`${API_BASE}/roadmaps/${roadmapId}/toggle-task`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ taskId })
    });
    return res.json();
  },

  // Resume Analyzer
  analyzeResume: async (data: { resumeText: string; targetCompany?: string; targetRole?: string }) => {
    const res = await fetch(`${API_BASE}/resume/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Bookmarks
  getBookmarks: async () => {
    const res = await fetch(`${API_BASE}/bookmarks`, { headers: getHeaders() });
    return res.json();
  },
  toggleBookmark: async (item_type: 'question' | 'company' | 'experience' | 'problem', item_id: number) => {
    const res = await fetch(`${API_BASE}/bookmarks/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ item_type, item_id })
    });
    return res.json();
  },

  // Progress Dashboard
  getProgress: async () => {
    const res = await fetch(`${API_BASE}/progress`, { headers: getHeaders() });
    return res.json();
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, { headers: getHeaders() });
    return res.json();
  },
  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: getHeaders() });
    return res.json();
  },
  updateUserRole: async (userId: number, role: 'student' | 'admin') => {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role })
    });
    return res.json();
  }
};
