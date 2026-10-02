import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, Question } from '../services/api';
import { QuestionCard } from '../components/QuestionCard';
import { Search, Filter, BookOpen, Layers, Flame, CheckCircle, RefreshCw } from 'lucide-react';

export const Questions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const topicParam = searchParams.get('topic') || 'All';
  const companyParam = searchParams.get('company') || 'All';
  const difficultyParam = searchParams.get('difficulty') || 'All';
  const frequencyParam = searchParams.get('frequency') || 'All';
  const searchParam = searchParams.get('search') || '';

  const [search, setSearch] = useState(searchParam);
  const [topic, setTopic] = useState(topicParam);
  const [company, setCompany] = useState(companyParam);
  const [difficulty, setDifficulty] = useState(difficultyParam);
  const [frequency, setFrequency] = useState(frequencyParam);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await api.getQuestions({
        topic: topic !== 'All' ? topic : undefined,
        company: company !== 'All' ? company : undefined,
        difficulty: difficulty !== 'All' ? difficulty : undefined,
        frequency: frequency !== 'All' ? frequency : undefined,
        search: search || undefined
      });
      setQuestions(res.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [topic, company, difficulty, frequency]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const topicsList = [
    'All',
    'DSA',
    'SQL',
    'DBMS',
    'Operating Systems',
    'Computer Networks',
    'OOP',
    'Web Development',
    'HR & Behavioral'
  ];

  const companiesList = [
    'All',
    'Amazon',
    'Google',
    'Microsoft',
    'TCS',
    'Infosys',
    'Accenture',
    'Deloitte',
    'Oracle',
    'Salesforce',
    'Zoho',
    'Uber',
    'Meta'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Curated Question Bank
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Placement Interview Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Search hundreds of frequently reported interview questions categorized across DSA, Core CS, SQL, Web, and HR rounds with beginner-friendly explanations and interview tips.
        </p>
      </div>

      {/* Filter Panel */}
      <div className="glass-panel p-4 rounded-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword (e.g. Normalization, Two Sum, Deadlock, ACID, Joins)..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Search Questions</span>
          </button>
        </form>

        {/* Multi-Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs">
          
          {/* Topic */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Domain / Topic:</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Reported Company:</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
            >
              {companiesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Report Frequency:</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Frequencies</option>
              <option value="Frequently Reported">🔥 Frequently Reported</option>
              <option value="Occasionally Reported">Occasionally Reported</option>
              <option value="Recently Reported">Recently Reported</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="h-28 rounded-xl bg-slate-900/50 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No questions found</h3>
          <p className="text-xs text-slate-400 mt-1">Try broadening your search query or selecting "All" topics.</p>
          <button
            onClick={() => {
              setSearch('');
              setTopic('All');
              setCompany('All');
              setDifficulty('All');
              setFrequency('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-xs text-sky-400 font-medium hover:bg-slate-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-slate-200">{questions.length}</strong> questions matching current criteria
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
