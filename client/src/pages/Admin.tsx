import React, { useState, useEffect } from 'react';
import { api, Company, Question, InterviewExperience, User } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Building2,
  BookOpen,
  MessageSquare,
  Users,
  PlusCircle,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'companies' | 'questions' | 'experiences' | 'users'>('stats');
  const [loading, setLoading] = useState(true);

  // Entities state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);

  // Company Modal State
  const [companyModal, setCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [companyForm, setCompanyForm] = useState({
    name: '',
    slug: '',
    description: '',
    industry: 'Technology',
    difficulty: 'Medium',
    popular_roles: 'Software Development Engineer',
    eligibility: 'B.Tech with 60%+',
    hiring_type: 'Campus & Off-Campus',
    website: 'https://careers.google.com'
  });

  // Question Modal State
  const [questionModal, setQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionForm, setQuestionForm] = useState({
    question: '',
    answer: '',
    topic: 'DSA',
    difficulty: 'Medium',
    question_type: 'Technical Interview',
    interview_tip: '',
    tags: 'Core CS'
  });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, compRes, qRes, expRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getCompanies(),
        api.getQuestions(),
        api.getExperiences(),
        api.getAdminUsers()
      ]);
      setStats(statsRes.stats);
      setCompanies(compRes.companies || []);
      setQuestions(qRes.questions || []);
      setExperiences(expRes.experiences || []);
      setUsersList(usersRes.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Company CRUD
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await api.updateCompany(editingCompany.id, companyForm);
      } else {
        await api.createCompany(companyForm);
      }
      setCompanyModal(false);
      setEditingCompany(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save company');
    }
  };

  const handleDeleteCompany = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this company and its rounds?')) return;
    try {
      await api.deleteCompany(id);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete company');
    }
  };

  // Question CRUD
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await api.updateQuestion(editingQuestion.id, questionForm);
      } else {
        await api.createQuestion(questionForm);
      }
      setQuestionModal(false);
      setEditingQuestion(null);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save question');
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.deleteQuestion(id);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  // Experience Moderation
  const handleModerateExperience = async (id: number, status: string) => {
    try {
      await api.updateExperienceStatus(id, status);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  // User Role Switch
  const handleToggleUserRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    try {
      await api.updateUserRole(userId, newRole);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle user role');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrative Control Panel
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Platform Management & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Add/edit companies, curate question banks, moderate reported candidate interview experiences, and view usage metrics.
          </p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        {[
          { id: 'stats', label: 'Platform Stats', icon: TrendingUp },
          { id: 'companies', label: `Companies (${companies.length})`, icon: Building2 },
          { id: 'questions', label: `Questions (${questions.length})`, icon: BookOpen },
          { id: 'experiences', label: `Interview Experiences (${experiences.length})`, icon: MessageSquare },
          { id: 'users', label: `Users (${usersList.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                active
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Stats Overview */}
      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-medium">Total Registered Users</span>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-medium">Active Companies</span>
              <div className="text-2xl font-bold text-sky-400">{stats.totalCompanies}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-medium">Curated Questions</span>
              <div className="text-2xl font-bold text-indigo-400">{stats.totalQuestions}</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-medium">Mock Interviews Conducted</span>
              <div className="text-2xl font-bold text-emerald-400">{stats.mockInterviewsConducted}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Companies Management */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Manage all 20+ company recruitment specifications</span>
            <button
              onClick={() => {
                setEditingCompany(null);
                setCompanyForm({
                  name: '',
                  slug: '',
                  description: '',
                  industry: 'Technology',
                  difficulty: 'Medium',
                  popular_roles: 'Software Development Engineer',
                  eligibility: 'B.Tech with 60%+',
                  hiring_type: 'Campus & Off-Campus',
                  website: 'https://careers.google.com'
                });
                setCompanyModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Company</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                  <th className="p-3.5">Company Name</th>
                  <th className="p-3.5">Industry</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5">Questions</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-white">{c.name}</td>
                    <td className="p-3.5 text-slate-300">{c.industry}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        {c.difficulty}
                      </span>
                    </td>
                    <td className="p-3.5 text-sky-400 font-semibold">{c.question_count || 12} Qs</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingCompany(c);
                          setCompanyForm({
                            name: c.name,
                            slug: c.slug,
                            description: c.description,
                            industry: c.industry,
                            difficulty: c.difficulty,
                            popular_roles: c.popular_roles,
                            eligibility: c.eligibility,
                            hiring_type: c.hiring_type,
                            website: c.website
                          });
                          setCompanyModal(true);
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompany(c.id)}
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Questions Management */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Curate question bank & model explanations</span>
            <button
              onClick={() => {
                setEditingQuestion(null);
                setQuestionForm({
                  question: '',
                  answer: '',
                  topic: 'DSA',
                  difficulty: 'Medium',
                  question_type: 'Technical Interview',
                  interview_tip: '',
                  tags: 'Core CS'
                });
                setQuestionModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                  <th className="p-3.5">Question</th>
                  <th className="p-3.5">Topic</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-medium text-slate-100 max-w-md truncate">{q.question}</td>
                    <td className="p-3.5 text-sky-400 font-semibold">{q.topic}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingQuestion(q);
                          setQuestionForm({
                            question: q.question,
                            answer: q.answer,
                            topic: q.topic,
                            difficulty: q.difficulty,
                            question_type: q.question_type,
                            interview_tip: q.interview_tip || '',
                            tags: q.tags || ''
                          });
                          setQuestionModal(true);
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Experience Moderation */}
      {activeTab === 'experiences' && (
        <div className="space-y-4">
          <span className="text-xs text-slate-400">Review & approve candidate submissions before public publication</span>
          
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{exp.company_name}</strong>
                    <span className="text-sky-400">({exp.role_title})</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{exp.author_name} ({exp.college})</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{exp.questions_summary}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                    exp.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {exp.status.toUpperCase()}
                  </span>

                  {exp.status !== 'approved' && (
                    <button
                      onClick={() => handleModerateExperience(exp.id, 'approved')}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                    >
                      Approve
                    </button>
                  )}
                  {exp.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerateExperience(exp.id, 'rejected')}
                      className="px-3 py-1 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 font-semibold"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Users List */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">College</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-bold text-white">{u.name}</td>
                  <td className="p-3.5 text-slate-300">{u.email}</td>
                  <td className="p-3.5 text-slate-400">{u.college || 'Engineering'}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-sky-500/20 text-sky-400'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleToggleUserRole(u.id, u.role)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                    >
                      Make {u.role === 'admin' ? 'Student' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Company Modal */}
      {companyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">{editingCompany ? 'Edit Company' : 'Add New Company'}</h3>
              <button onClick={() => setCompanyModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveCompany} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Industry</label>
                  <input
                    type="text"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Difficulty</label>
                  <select
                    value={companyForm.difficulty}
                    onChange={(e) => setCompanyForm({ ...companyForm, difficulty: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={companyForm.description}
                  onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setCompanyModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold">Save Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Modal */}
      {questionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
              <button onClick={() => setQuestionModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveQuestion} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Question Title *</label>
                <input
                  type="text"
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Topic</label>
                  <select
                    value={questionForm.topic}
                    onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    {['DSA', 'SQL', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP', 'Web Development', 'HR & Behavioral'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Model Answer / Solution</label>
                <textarea
                  rows={4}
                  value={questionForm.answer}
                  onChange={(e) => setQuestionForm({ ...questionForm, answer: e.target.value })}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setQuestionModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold">Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
