import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Code, Terminal, BookOpen, Bot, Briefcase } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Col 1: Platform Overview */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Placement<span className="gradient-text">Guide</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An intelligent placement preparation platform that converts a student's target role and skill level into a structured, company-specific preparation journey with AI mock interviews, coding practice, and progress analytics.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                🚀 20+ Top Tech Companies
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                💡 500+ Curated Questions
              </span>
            </div>
          </div>

          {/* Col 2: Core Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Preparation Hub</h4>
            <ul className="space-y-2">
              <li><Link to="/companies" className="hover:text-sky-400 transition-colors">Company Directory</Link></li>
              <li><Link to="/questions" className="hover:text-sky-400 transition-colors">Question Bank</Link></li>
              <li><Link to="/practice" className="hover:text-sky-400 transition-colors">Practice Quizzes & Sandbox</Link></li>
              <li><Link to="/mock-interview" className="hover:text-sky-400 transition-colors">AI Mock Interview</Link></li>
              <li><Link to="/roadmap" className="hover:text-sky-400 transition-colors">Personalized Roadmaps</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Top Topics</h4>
            <ul className="space-y-2">
              <li><Link to="/questions?topic=DSA" className="hover:text-sky-400 transition-colors">Data Structures & Algorithms</Link></li>
              <li><Link to="/questions?topic=SQL" className="hover:text-sky-400 transition-colors">SQL & Database Queries</Link></li>
              <li><Link to="/questions?topic=DBMS" className="hover:text-sky-400 transition-colors">DBMS & Normalization</Link></li>
              <li><Link to="/questions?topic=Operating%20Systems" className="hover:text-sky-400 transition-colors">Operating Systems Internals</Link></li>
              <li><Link to="/questions?topic=Computer%20Networks" className="hover:text-sky-400 transition-colors">Computer Networks & Web</Link></li>
              <li><Link to="/questions?topic=HR%20%26%20Behavioral" className="hover:text-sky-400 transition-colors">HR & Behavioral STAR Qs</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Information Quality</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Content is crowd-sourced from reported campus and off-campus interview experiences, verified by technical administrators. AI feedback is intended for practice guidance.
            </p>
            <div className="pt-2">
              <Link to="/experiences" className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300">
                <span>View Interview Experiences</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 Placement Guide. Built as a comprehensive Full-Stack Placement Platform.</p>
          <div className="flex items-center gap-6">
            <span>Secure JWT Auth</span>
            <span>•</span>
            <span>REST API Spec Compliant</span>
            <span>•</span>
            <span>Zero Data Redundancy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
