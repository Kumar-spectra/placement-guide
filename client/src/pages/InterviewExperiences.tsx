import React, { useState, useEffect } from 'react';
import { api, InterviewExperience, Company } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Search,
  PlusCircle,
  Building2,
  Award,
  CheckCircle,
  Clock,
  X,
  Sparkles,
  Lightbulb
} from 'lucide-react';

export const InterviewExperiences: React.FC = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedResult, setSelectedResult] = useState('All');

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company_id: '',
    role_title: 'Software Engineer',
    year: 2026,
    college: user?.college || '',
    difficulty: 'Medium',
    selection_result: 'Selected',
    rounds_data: [
      { round_name: 'Round 1: Online Assessment', details: '' },
      { round_name: 'Round 2: Technical Interview', details: '' }
    ],
    questions_summary: '',
    additional_tips: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, compRes] = await Promise.all([
        api.getExperiences({
          company: selectedCompany !== 'All' ? selectedCompany : undefined,
          result: selectedResult !== 'All' ? selectedResult : undefined,
          search: search || undefined
        }),
        api.getCompanies()
      ]);
      setExperiences(expRes.experiences || []);
      setCompanies(compRes.companies || []);
      if (compRes.companies && compRes.companies.length > 0 && !formData.company_id) {
        setFormData(prev => ({ ...prev, company_id: String(compRes.companies[0].id) }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCompany, selectedResult]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleAddRound = () => {
    setFormData({
      ...formData,
      rounds_data: [
        ...formData.rounds_data,
        { round_name: `Round ${formData.rounds_data.length + 1}: Technical / HR`, details: '' }
      ]
    });
  };

  const handleRoundChange = (index: number, field: 'round_name' | 'details', value: string) => {
    const updated = [...formData.rounds_data];
    updated[index][field] = value;
    setFormData({ ...formData, rounds_data: updated });
  };

  const handleSubmitExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.submitExperience(formData);
      setSubmitMessage(res.message || 'Experience submitted!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitMessage(null);
        fetchData();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit experience');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Peer Interview Insights
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interview Experiences Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real candidate reports detailing on-campus & off-campus recruitment rounds, questions asked, and preparation advice.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Share Your Experience</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experiences by role, college, questions asked..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Company:</span>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Result:</span>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Results</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experience Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-xl bg-slate-900/50 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl">
          <MessageSquare className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No interview experiences found</h3>
          <p className="text-xs text-slate-400 mt-1">Be the first student to share an interview experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sky-400 border border-slate-700">
                    {exp.company_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{exp.company_name}</span>
                      <span className="text-xs text-slate-400 font-normal">({exp.role_title})</span>
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-slate-300">{exp.author_name}</span>
                      <span>•</span>
                      <span>{exp.college}</span>
                      <span>•</span>
                      <span>Batch {exp.year}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${
                    exp.selection_result === 'Selected'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {exp.selection_result}
                  </span>
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    {exp.difficulty} Difficulty
                  </span>
                </div>
              </div>

              {/* Round Details */}
              <div className="space-y-2.5 text-xs">
                <strong className="text-slate-300 block font-semibold">Interview Breakdown:</strong>
                {Array.isArray(exp.rounds_data) && exp.rounds_data.map((r, i) => (
                  <div key={i} className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-0.5">
                    <span className="font-bold text-sky-400">{r.round_name}: </span>
                    <p className="text-slate-300 leading-relaxed pt-0.5">{r.details}</p>
                  </div>
                ))}
              </div>

              {/* Key questions */}
              {exp.questions_summary && (
                <div className="text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                  <strong className="text-indigo-400 block mb-0.5 font-semibold">Questions Summary:</strong>
                  <p>{exp.questions_summary}</p>
                </div>
              )}

              {/* Tips */}
              {exp.additional_tips && (
                <div className="text-xs bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400 block mb-0.5 font-semibold">Candidate's Advice to Juniors:</strong>
                    <span>{exp.additional_tips}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full my-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-sky-400" />
                <span>Submit Placement Interview Experience</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitMessage ? (
              <div className="p-6 text-center text-emerald-400 font-semibold text-sm">
                <CheckCircle className="w-10 h-10 mx-auto mb-2" />
                <p>{submitMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitExperience} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Target Company *</label>
                    <select
                      value={formData.company_id}
                      onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Job Role Title *</label>
                    <input
                      type="text"
                      value={formData.role_title}
                      onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                      required
                      placeholder="e.g. SDE-1 / Software Developer"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">College / University</label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      placeholder="e.g. NIT / VIT / SRM"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-medium block mb-1">Selection Result</label>
                    <select
                      value={formData.selection_result}
                      onChange={(e) => setFormData({ ...formData, selection_result: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    >
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Dynamic Rounds */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-semibold">Interview Rounds Breakdown *</label>
                    <button
                      type="button"
                      onClick={handleAddRound}
                      className="text-sky-400 hover:text-sky-300 font-medium"
                    >
                      + Add Another Round
                    </button>
                  </div>

                  {formData.rounds_data.map((round, idx) => (
                    <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-2">
                      <input
                        type="text"
                        value={round.round_name}
                        onChange={(e) => handleRoundChange(idx, 'round_name', e.target.value)}
                        placeholder="Round Title (e.g. Round 1: OA, Round 2: DSA)"
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-medium"
                      />
                      <textarea
                        rows={2}
                        value={round.details}
                        onChange={(e) => handleRoundChange(idx, 'details', e.target.value)}
                        placeholder="What happened in this round? Questions asked, duration, interviewer vibe..."
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Specific Questions Asked (Summary)</label>
                  <input
                    type="text"
                    value={formData.questions_summary}
                    onChange={(e) => setFormData({ ...formData, questions_summary: e.target.value })}
                    placeholder="e.g. LRU Cache, Binary Tree LCA, SQL Joins, Normalization"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Advice & Tips for Juniors</label>
                  <textarea
                    rows={2}
                    value={formData.additional_tips}
                    onChange={(e) => setFormData({ ...formData, additional_tips: e.target.value })}
                    placeholder="What strategy worked for you? What should candidates focus on?"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Publish Experience'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
