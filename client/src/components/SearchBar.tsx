import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Building2, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';

interface SearchBarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchBarModal: React.FC<SearchBarModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [companies, setCompanies] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setCompanies([]);
      setQuestions([]);
    }
  }, [isOpen]);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setCompanies([]);
      setQuestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [cRes, qRes] = await Promise.all([
          api.getCompanies({ search: query }),
          api.getQuestions({ search: query })
        ]);
        setCompanies((cRes.companies || []).slice(0, 4));
        setQuestions((qRes.questions || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-sky-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company (Amazon, TCS), role, DSA, SQL, DBMS, question..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 text-xs">
          {loading && (
            <div className="py-8 text-center text-slate-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
              <span>Searching across placement records...</span>
            </div>
          )}

          {!loading && !query && (
            <div className="py-6 text-center text-slate-500">
              <p className="font-medium text-slate-400 mb-1">Quick Search Platform Material</p>
              <p className="text-[11px]">Type any company, topic, algorithm, or interview keyword</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {['Amazon SDE', 'Normalization', 'SQL Joins', 'Two Sum', 'TCS Prime', 'ACID Properties'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && query && companies.length === 0 && questions.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p>No direct matches found for "{query}"</p>
              <p className="text-[11px] text-slate-500 mt-1">Try searching broader terms like "DSA", "DBMS", "Amazon", or "SQL"</p>
            </div>
          )}

          {/* Companies Match */}
          {companies.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400" /> Companies
              </div>
              <div className="space-y-1.5">
                {companies.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      navigate(`/company/${c.slug}`);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 hover:bg-sky-500/10 hover:border-sky-500/30 border border-slate-800 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-sky-400">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.popular_roles}</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-sky-400 flex items-center gap-1">
                      Prep Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions Match */}
          {questions.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Questions & Solutions
              </div>
              <div className="space-y-1.5">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      navigate(`/questions/${q.id}`);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-slate-800/60 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-slate-800 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        {q.topic}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {q.difficulty}
                      </span>
                    </div>
                    <div className="font-medium text-slate-200 line-clamp-1">{q.question}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tip: Use Tab or arrows to navigate</span>
          <button
            onClick={() => {
              navigate(`/questions?search=${encodeURIComponent(query)}`);
              onClose();
            }}
            className="text-sky-400 hover:text-sky-300 font-medium"
          >
            See all question bank results →
          </button>
        </div>
      </div>
    </div>
  );
};
