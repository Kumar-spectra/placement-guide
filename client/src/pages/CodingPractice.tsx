import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, CodingProblem } from '../services/api';
import {
  Code2,
  Play,
  CheckCircle,
  XCircle,
  Lightbulb,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Check,
  Terminal,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CodingPractice: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await api.getCodingProblemDetails(slug);
        if (res.problem) {
          setProblem(res.problem);
          setCode(res.problem.starter_code);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [slug]);

  const handleRunCode = async () => {
    if (!problem) return;
    try {
      setRunning(true);
      setResults(null);
      const res = await api.runCode({
        code,
        problem_id: problem.id,
        language
      });
      setResults(res);
      if (res.allPassed) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    if (problem) {
      setCode(problem.starter_code);
      setResults(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Sparkles className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading coding problem environment...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Problem not found</h2>
        <Link to="/practice" className="text-xs text-sky-400 mt-2 inline-block">
          ← Back to Practice Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenges</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
            problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {problem.difficulty}
          </span>
          <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {problem.topic}
          </span>
        </div>
      </div>

      {/* Split Pane: Left Description | Right Editor & Test Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Problem Details (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white tracking-tight">{problem.title}</h1>
            <p className="text-[11px] text-slate-400">Asked in: {problem.companies}</p>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p className="whitespace-pre-line">{problem.description}</p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Examples</h3>
            {Array.isArray(problem.examples) && problem.examples.map((ex, i) => (
              <div key={i} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div><span className="text-slate-500">Input:</span> <span className="text-slate-200">{ex.input}</span></div>
                <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400">{ex.output}</span></div>
                {ex.explanation && (
                  <div className="text-[11px] font-sans text-slate-400 pt-1">
                    <span className="text-slate-500">Explanation:</span> {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Constraints</h3>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 whitespace-pre-line">
                {problem.constraints}
              </div>
            </div>
          )}

          {/* Hints & Solution Toggle */}
          <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
            {problem.hints && (
              <div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'View Problem Hint'}</span>
                </button>
                {showHint && (
                  <p className="mt-1.5 p-2.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs">
                    {problem.hints}
                  </p>
                )}
              </div>
            )}

            {problem.solution_code && (
              <div>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{showSolution ? 'Hide Solution Code' : 'Reveal Solution Code'}</span>
                </button>
                {showSolution && (
                  <pre className="mt-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                    {problem.solution_code}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Editor Header Bar */}
          <div className="glass-panel p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded px-2 py-1"
              >
                <option value="javascript">JavaScript (ES6)</option>
                <option value="python">Python 3 (Sandbox)</option>
                <option value="java">Java (Sandbox)</option>
                <option value="cpp">C++ (Sandbox)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Reset to starter code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleRunCode}
                disabled={running}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{running ? 'Running Tests...' : 'Run & Test'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="bg-[#0B0F17] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>solution.js</span>
              <span>UTF-8</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              spellCheck={false}
              className="w-full bg-[#0B0F17] p-4 text-xs font-mono text-emerald-400 focus:outline-none leading-relaxed resize-y selection:bg-emerald-500/30"
              placeholder="// Type your algorithm solution here..."
            />
          </div>

          {/* Test Case Execution Output Panel */}
          {results && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {results.allPassed ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>All Test Cases Passed! ({results.passedTestCases}/{results.totalTestCases})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                      <XCircle className="w-4 h-4" />
                      <span>Test Cases Failed ({results.passedTestCases}/{results.totalTestCases} passed)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Individual Test Cases */}
              <div className="space-y-2 text-xs font-mono">
                {results.results?.map((tc: any) => (
                  <div
                    key={tc.testCaseNumber}
                    className={`p-3 rounded-lg border text-xs ${
                      tc.passed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                        : 'bg-rose-950/20 border-rose-500/30 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold flex items-center gap-1.5">
                        {tc.passed ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        )}
                        <span>Test Case {tc.testCaseNumber}</span>
                      </span>
                      {tc.runtimeMs && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {tc.runtimeMs} ms
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div><span className="text-slate-500">Expected:</span> <span className="text-emerald-400">{JSON.stringify(tc.expected)}</span></div>
                      <div><span className="text-slate-500">Actual:</span> <span className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>{JSON.stringify(tc.actual)}</span></div>
                    </div>

                    {tc.error && (
                      <div className="text-rose-400 text-[11px] pt-1 mt-1 border-t border-rose-500/20">
                        Error: {tc.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
