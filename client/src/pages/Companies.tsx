import React, { useState, useEffect } from 'react';
import { api, Company } from '../services/api';
import { CompanyCard } from '../components/CompanyCard';
import { Search, Filter, Briefcase, Building2, SlidersHorizontal, Layers, CheckCircle2 } from 'lucide-react';

export const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [industry, setIndustry] = useState('All');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.getCompanies({
        search: search || undefined,
        difficulty: difficulty !== 'All' ? difficulty : undefined,
        industry: industry !== 'All' ? industry : undefined
      });
      setCompanies(res.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [difficulty, industry]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies();
  };

  const industries = [
    'All',
    'Cloud',
    'E-Commerce',
    'IT Services',
    'Consulting',
    'Software',
    'Mobility',
    'Semiconductors'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> Company Directory & Hiring Guides
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore Placement Companies
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Browse recruitment processes, round formats, eligibility criteria, and frequently asked interview questions for top product and service tech companies.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name, role, or technology..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Filter Companies</span>
          </button>
        </form>

        {/* Filters: Difficulty & Industry */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          
          {/* Difficulty Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Difficulty:</span>
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  difficulty === diff
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Industry Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Industry:</span>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-sky-500"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Company Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-56 rounded-xl bg-slate-900/50 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-xl">
          <Building2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No companies match your search</h3>
          <p className="text-xs text-slate-400 mt-1">Try clearing filters or changing search keywords.</p>
          <button
            onClick={() => {
              setSearch('');
              setDifficulty('All');
              setIndustry('All');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-xs text-sky-400 font-medium hover:bg-slate-700"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{companies.length}</strong> top technology companies
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
