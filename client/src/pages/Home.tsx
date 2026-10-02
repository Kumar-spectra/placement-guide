import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, Company, Question } from '../services/api';
import { CompanyCard } from '../components/CompanyCard';
import { QuestionCard } from '../components/QuestionCard';
import { CompanyLogo } from '../components/CompanyLogo';
import {
  Search,
  Sparkles,
  Bot,
  Compass,
  Code2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Award,
  Zap,
  Flame,
  Star,
  ShieldCheck,
  CheckCircle2,
  Users,
  FileText
} from 'lucide-react';

// Stats counter
const STATS = [
  { value: '500+', label: 'Interview Questions', icon: BookOpen },
  { value: '20+', label: 'Top Tech Companies', icon: Briefcase },
  { value: '100+', label: 'Interview Experiences', icon: Users },
  { value: 'AI', label: 'Mock Interview Engine', icon: Bot },
];

// Ticker companies (logo marquee)
const TICKER_COMPANIES = [
  { name: 'Amazon', slug: 'amazon' },
  { name: 'Google', slug: 'google' },
  { name: 'Microsoft', slug: 'microsoft' },
  { name: 'Meta', slug: 'meta' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Adobe', slug: 'adobe' },
  { name: 'Salesforce', slug: 'salesforce' },
  { name: 'Oracle', slug: 'oracle' },
  { name: 'IBM', slug: 'ibm' },
  { name: 'Cisco', slug: 'cisco' },
  { name: 'Intel', slug: 'intel' },
  { name: 'TCS', slug: 'tcs' },
  { name: 'Infosys', slug: 'infosys' },
  { name: 'Accenture', slug: 'accenture' },
  { name: 'Deloitte', slug: 'deloitte' },
  { name: 'Zoho', slug: 'zoho' },
  { name: 'Cognizant', slug: 'cognizant' },
  { name: 'Flipkart', slug: 'flipkart' },
  { name: 'Atlassian', slug: 'atlassian' },
  { name: 'Uber', slug: 'uber' },
];

export const Home: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [popularQuestions, setPopularQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, qRes] = await Promise.all([
          api.getCompanies(),
          api.getQuestions({ frequency: 'Frequently Reported' })
        ]);
        setCompanies(compRes.companies || []);
        setPopularQuestions((qRes.questions || []).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/questions?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: 'DSA & Algorithms', topic: 'DSA', count: '120+', icon: Code2, color: 'from-sky-500 to-blue-600' },
    { name: 'SQL & Database', topic: 'SQL', count: '65+', icon: Layers, color: 'from-indigo-500 to-violet-600' },
    { name: 'DBMS & Design', topic: 'DBMS', count: '45+', icon: BookOpen, color: 'from-purple-500 to-pink-600' },
    { name: 'Operating Systems', topic: 'Operating Systems', count: '40+', icon: Zap, color: 'from-amber-500 to-orange-600' },
    { name: 'Computer Networks', topic: 'Computer Networks', count: '35+', icon: Compass, color: 'from-emerald-500 to-teal-600' },
    { name: 'OOP Principles', topic: 'OOP', count: '50+', icon: Award, color: 'from-rose-500 to-red-600' },
    { name: 'Web Dev & React', topic: 'Web Development', count: '55+', icon: Sparkles, color: 'from-cyan-500 to-sky-600' },
    { name: 'HR & Behavioral', topic: 'HR & Behavioral', count: '40+', icon: Bot, color: 'from-fuchsia-500 to-purple-600' },
  ];

  // Duplicate for seamless ticker loop
  const tickerItems = [...TICKER_COMPANIES, ...TICKER_COMPANIES];

  return (
    <div className="space-y-20 pb-28 relative z-10">

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="relative pt-16 pb-4 overflow-hidden text-center">
        {/* Large ambient orbs */}
        <div className="glow-blob w-[700px] h-[500px] bg-sky-500/25 top-[-100px] left-[calc(50%-350px)]" />
        <div className="glow-blob w-[500px] h-[400px] bg-indigo-500/20 top-[0px] left-[calc(30%-250px)]" />
        <div className="glow-blob w-[400px] h-[350px] bg-purple-500/15 top-[0px] right-[calc(25%-200px)]" />

        <div className="max-w-5xl mx-auto px-4 space-y-8 relative z-10">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-bold shadow-lg shadow-sky-500/10 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>AI-Powered Placement Preparation Platform — 2026</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-balance">
            <span className="text-white">Crack Your</span>
            <br />
            <span className="gradient-text">Dream Placement</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Company-specific guides, round-wise questions, live AI mock interviews,
            real interview experiences and personalized 60-day roadmaps — all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-[#0a1120]/90 border border-white/[0.12] rounded-2xl p-2 shadow-2xl focus-within:border-sky-400/60 focus-within:ring-4 focus-within:ring-sky-500/15 transition-all backdrop-blur-2xl">
              <Search className="w-5 h-5 text-sky-400 ml-3 flex-shrink-0" />
              <input
                id="hero-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company (Amazon, TCS), topic (DSA, SQL), or question..."
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 btn-gradient text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Trending badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Trending:
            </span>
            {['Amazon', 'Microsoft', 'Google', 'TCS', 'Infosys', 'Accenture', 'Deloitte', 'Zoho'].map((name) => (
              <Link
                key={name}
                to={`/company/${name.toLowerCase()}`}
                className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.10] text-slate-300 border border-white/[0.08] hover:border-sky-500/40 font-semibold transition-all shadow-sm hover:text-white"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-panel rounded-2xl p-5 text-center border border-white/[0.07] group hover:border-sky-500/30 transition-all">
                <div className="flex justify-center mb-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-sky-400" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black gradient-text">{stat.value}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Company Logo Ticker ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="text-center">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Companies Covered
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Top 20+ Tech Companies — Full Interview Guides
          </h2>
        </div>

        {/* Scrolling ticker */}
        <div className="logo-ticker-wrap py-3">
          <div className="animate-marquee">
            {tickerItems.map((co, i) => (
              <Link
                key={i}
                to={`/company/${co.slug}`}
                className="flex items-center gap-2.5 px-5 py-2.5 mx-2 rounded-xl glass-panel border border-white/[0.07] hover:border-sky-500/30 transition-all group flex-shrink-0"
              >
                <CompanyLogo name={co.name} slug={co.slug} size="sm" className="flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                  {co.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Action Cards ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Question Bank', desc: '500+ round-wise Qs', path: '/questions', icon: BookOpen, color: 'text-sky-400 bg-sky-500/15', glow: 'group-hover:shadow-sky-500/20' },
            { title: 'AI Mock Interview', desc: 'Instant AI Evaluation', path: '/mock-interview', icon: Bot, color: 'text-purple-400 bg-purple-500/15', glow: 'group-hover:shadow-purple-500/20' },
            { title: 'Coding Sandbox', desc: 'Live JS Test Runner', path: '/practice', icon: Code2, color: 'text-emerald-400 bg-emerald-500/15', glow: 'group-hover:shadow-emerald-500/20' },
            { title: '60-Day Roadmap', desc: 'Week-by-week tasks', path: '/roadmap', icon: Compass, color: 'text-amber-400 bg-amber-500/15', glow: 'group-hover:shadow-amber-500/20' },
            { title: 'Readiness Meter', desc: 'Weak area analysis', path: '/dashboard', icon: TrendingUp, color: 'text-rose-400 bg-rose-500/15', glow: 'group-hover:shadow-rose-500/20' },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                to={action.path}
                className={`glass-panel glass-panel-hover border-gradient rounded-2xl p-5 flex flex-col items-start gap-3 group shadow-lg ${action.glow}`}
              >
                <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Popular Companies Grid ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Company Hiring Guides
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Top Tech Companies Hiring Freshers & SDEs
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Complete round structures, typical questions, eligibility and interview timelines.
            </p>
          </div>

          <Link
            to="/companies"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 group shrink-0"
          >
            <span>Explore All {companies.length || '20'}+ Companies</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-60 rounded-2xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.slice(0, 6).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </section>

      {/* ── Preparation Categories ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Structured Learning
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Preparation by Technical Domain
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Master fundamental subjects with frequently reported interview questions.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                to={`/questions?topic=${encodeURIComponent(cat.topic)}`}
                className="glass-panel glass-panel-hover border-gradient rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 bg-white/[0.06] px-2 py-0.5 rounded-full border border-white/[0.08]">
                    {cat.count} Qs
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 mt-0.5 block font-medium">
                    Practice Questions →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Platform Advantage Banner ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-7 sm:p-12 border border-sky-500/20 relative overflow-hidden shadow-2xl">
          {/* Ambient glow inside */}
          <div className="glow-blob w-96 h-96 bg-sky-500/15 top-[-80px] right-[-60px]" />
          <div className="glow-blob w-64 h-64 bg-indigo-500/10 bottom-[-40px] left-[-30px]" />

          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-black text-sky-400 uppercase tracking-wider block mb-3">
              The Placement Guide Advantage
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              An intelligent preparation journey that converts your target role into measurable success.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-2xl">
              Instead of searching across dozens of disconnected forums, follow a curated workflow:
              <strong className="text-sky-300"> Select Target Company → </strong>
              <strong className="text-indigo-300"> Follow 60-Day Roadmap → </strong>
              <strong className="text-purple-300"> Solve Verified Questions → </strong>
              <strong className="text-pink-300"> Take AI Mock Interviews → </strong>
              <strong className="text-emerald-300"> Review Weak Areas</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/[0.08] relative z-10">
            {[
              { step: '1', title: 'Target Role & Skills', desc: 'Pick your desired role (SDE, Full Stack, Data) and target companies.', color: 'text-sky-400 bg-sky-500/20' },
              { step: '2', title: 'Round-Wise Practice', desc: 'Practice verified questions for Online Assessments, Technical & HR rounds.', color: 'text-indigo-400 bg-indigo-500/20' },
              { step: '3', title: 'AI Feedback & Mock Drills', desc: 'Get evaluated on concept accuracy, technical depth, and communication.', color: 'text-purple-400 bg-purple-500/20' },
            ].map((item) => (
              <div key={item.step} className="space-y-2 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                <div className={`${item.color} font-bold text-sm flex items-center gap-2`}>
                  <span className={`w-6 h-6 rounded-full ${item.color} flex items-center justify-center text-xs font-black`}>{item.step}</span>
                  {item.title}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Frequently Reported Questions ────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-rose-400" /> High Frequency Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Reported in 2026 Interviews
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Top questions appearing in technical rounds across Amazon, Microsoft, TCS, Infosys, and Google.
            </p>
          </div>

          <Link
            to="/questions"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 group shrink-0"
          >
            <span>View Full Question Bank</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-40 rounded-2xl skeleton" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        )}
      </section>

      {/* ── Bottom CTA Banner ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-sky-900/60 via-indigo-900/50 to-purple-900/60 border border-sky-500/30 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="glow-blob w-[500px] h-[300px] bg-sky-500/20 top-[-50px] left-[calc(50%-250px)]" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-xs text-white/70 font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Ready to begin your placement journey?
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Start Preparing Smarter, <span className="gradient-text">Not Harder</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Generate a personalized 60-day roadmap or launch a live AI Mock Interview right now — completely free.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 relative z-10">
            <Link
              to="/mock-interview"
              className="px-7 py-3.5 rounded-xl btn-gradient text-white text-sm font-bold shadow-xl flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Mock Interview</span>
            </Link>

            <Link
              to="/roadmap"
              className="px-7 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/[0.16] text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Generate Placement Roadmap</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
