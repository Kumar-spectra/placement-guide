import React, { useState, useEffect } from 'react';
import { api, Question, Company } from '../services/api';
import { QuestionCard } from '../components/QuestionCard';
import { CompanyCard } from '../components/CompanyCard';
import { Bookmark, BookOpen, Building2, Sparkles } from 'lucide-react';

export const Bookmarks: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<'questions' | 'companies'>('questions');
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.getBookmarks();
      if (res.bookmarks) {
        setQuestions(res.bookmarks.questions || []);
        setCompanies(res.bookmarks.companies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5" /> Saved Placement Material
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          My Saved Bookmarks
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Quickly review questions, company hiring guides, and roadmap milestones you've saved for fast revision.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'questions'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Saved Questions ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'companies'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Target Companies ({companies.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <Sparkles className="w-6 h-6 text-sky-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading saved bookmarks...</p>
        </div>
      ) : activeTab === 'questions' ? (
        questions.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl">
            <Bookmark className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No saved questions</h3>
            <p className="text-xs text-slate-400 mt-1">Bookmark difficult or frequently reported questions to revise them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} onToggleBookmark={fetchBookmarks} />
            ))}
          </div>
        )
      ) : (
        companies.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl">
            <Building2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No target companies saved</h3>
            <p className="text-xs text-slate-400 mt-1">Bookmark companies to track their hiring processes easily.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((c) => (
              <CompanyCard key={c.id} company={c} onToggleBookmark={fetchBookmarks} />
            ))}
          </div>
        )
      )}

    </div>
  );
};
