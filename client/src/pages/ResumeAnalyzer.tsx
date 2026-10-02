import React, { useState } from 'react';
import { api } from '../services/api';
import {
  FileText,
  Sparkles,
  Bot,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Building2,
  Code2,
  Layers
} from 'lucide-react';

export const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState(`Kumar Babu - B.Tech CSE (2026 Batch)
Skills: React.js, TypeScript, Node.js, Express, PostgreSQL, Redis, Docker, Tailwind CSS, Python, DSA.
Projects:
1. E-Commerce Platform: Built a scalable full-stack multi-vendor shopping marketplace using React, Node.js, and PostgreSQL. Handled JWT authentication, inventory concurrency control, and Stripe webhook payment processing.
2. Real-Time Chat System: Built with WebSockets, Node.js, Redis pub/sub, and MongoDB for group messaging and active presence detection.`);
  const [targetCompany, setTargetCompany] = useState('Amazon');
  const [targetRole, setTargetRole] = useState('Software Development Engineer');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    try {
      setAnalyzing(true);
      const res = await api.analyzeResume({
        resumeText,
        targetCompany,
        targetRole
      });
      if (res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to analyze resume.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" /> AI Resume Deep-Dive Generator
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Resume-Based Interview Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Paste your resume text or project descriptions. The AI scans your skills, frameworks, and architecture to generate the exact deep-dive questions interviewers will ask.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
        <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Company</label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Amazon / Microsoft / TCS"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. SDE-1 / Full Stack"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Paste Resume Content (Projects, Tech Stack, Experience)</label>
            <textarea
              rows={6}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-sky-500 font-mono text-xs leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? 'Scanning Resume & Generating Questions...' : 'Analyze Resume & Generate Questions'}</span>
          </button>
        </form>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Detected Skills Chips */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>Extracted Tech Stack & Core Competencies</span>
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {analysis.detectedSkills?.map((skill: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Generated Questions Categories */}
          <div className="space-y-4">
            {analysis.generatedQuestions?.map((cat: any, cIndex: number) => (
              <div key={cIndex} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {cIndex + 1}
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {cat.category} {cat.project ? `(${cat.project})` : ''}
                  </h3>
                </div>

                <div className="space-y-2.5 pt-1 text-xs">
                  {cat.questions?.map((q: string, qIndex: number) => (
                    <div
                      key={qIndex}
                      className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 flex items-start gap-2.5 leading-relaxed"
                    >
                      <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          {analysis.tips && (
            <div className="glass-panel p-5 rounded-xl border border-amber-500/20 text-amber-200 text-xs space-y-2">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>Interviewer Pro Tips for Resume Rounds:</span>
              </strong>
              <ul className="space-y-1 text-slate-300">
                {analysis.tips.map((t: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
