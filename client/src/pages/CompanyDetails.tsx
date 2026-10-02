import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, Company, Round, Question, InterviewExperience } from '../services/api';
import { CompanyLogo } from '../components/CompanyLogo';
import { InterviewTimeline } from '../components/InterviewTimeline';
import { QuestionCard } from '../components/QuestionCard';
import {
  Building2,
  ExternalLink,
  Layers,
  HelpCircle,
  MessageSquare,
  Bot,
  Bookmark,
  Sparkles,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Calendar,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CompanyDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [activeTab, setActiveTab] = useState<'process' | 'questions' | 'experiences'>('process');
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.getCompanyDetails(slug);
        setCompany(res.company);
        setRounds(res.rounds || []);
        setQuestions(res.questions || []);
        setExperiences(res.experiences || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!company) return;
    try {
      const res = await api.toggleBookmark('company', company.id);
      setBookmarked(res.bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Sparkles className="w-6 h-6 text-sky-400 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading company recruitment specifications...</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Company not found</h2>
        <Link to="/companies" className="text-xs text-sky-400 mt-2 inline-block">
          ← Back to Company Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          {/* Logo + Details */}
          <div className="flex items-start gap-4">
            <CompanyLogo
              name={company.name}
              slug={company.slug}
              logoUrl={company.logo_url}
              size="xl"
            />
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {company.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {company.difficulty} Difficulty
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {company.industry}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
                {company.description}
              </p>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 pt-1"
                >
                  <span>Official Careers Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Action buttons: AI Mock Interview & Bookmark */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/mock-interview?company=${encodeURIComponent(company.name)}`}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>AI Mock for {company.name}</span>
            </Link>

            <button
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl border transition-all ${
                bookmarked
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Bookmark Company"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-sky-400" />
              <span>Popular Roles</span>
            </div>
            <p className="text-slate-100 font-semibold">{company.popular_roles}</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Eligibility & CGPA Criteria</span>
            </div>
            <p className="text-slate-100 font-semibold">{company.eligibility}</p>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <div className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Hiring Drives</span>
            </div>
            <p className="text-slate-100 font-semibold">{company.hiring_type}</p>
          </div>
        </div>
      </div>

      {/* 2. Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('process')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'process'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Interview Process & Rounds ({rounds.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'questions'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Reported Questions ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === 'experiences'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Interview Experiences ({experiences.length})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Hiring Overview & Strategy</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {company.interview_overview}
            </p>
          </div>

          <InterviewTimeline rounds={rounds} />
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-slate-200">{questions.length}</strong> questions reported from {company.name} placement rounds
            </span>
          </div>

          {questions.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-xl text-slate-400 text-xs">
              No questions directly tagged to this company yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'experiences' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Candidate Interview Experiences for {company.name}</span>
            <Link
              to="/experiences"
              className="text-sky-400 hover:text-sky-300 font-medium"
            >
              + Submit Your Experience
            </Link>
          </div>

          {experiences.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-xl text-slate-400 text-xs">
              No experiences submitted for {company.name} yet. Be the first to submit!
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{exp.author_name}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-400">{exp.college}</span>
                      </div>
                      <span className="text-xs text-sky-400 font-medium">{exp.role_title} ({exp.year})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {exp.selection_result}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {exp.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Rounds walkthrough */}
                  <div className="space-y-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-xs">
                    <strong className="text-slate-300 font-semibold block mb-1">Rounds Summary:</strong>
                    {Array.isArray(exp.rounds_data) && exp.rounds_data.map((r, i) => (
                      <div key={i} className="space-y-0.5 text-xs">
                        <span className="font-semibold text-slate-200">{r.round_name}: </span>
                        <span className="text-slate-400">{r.details}</span>
                      </div>
                    ))}
                  </div>

                  {exp.additional_tips && (
                    <div className="text-xs bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-amber-200">
                      <strong className="text-amber-400 block mb-0.5 font-semibold">Candidate's Advice:</strong>
                      <span>{exp.additional_tips}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
