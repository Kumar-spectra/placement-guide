import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, Question, CodingProblem } from '../services/api';
import {
  Code2,
  CheckCircle,
  HelpCircle,
  Clock,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Practice: React.FC = () => {
  const [mode, setMode] = useState<'hub' | 'quiz' | 'quiz_result'>('hub');
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>([]);
  
  // Quiz Setup
  const [topic, setTopic] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  
  // Active Quiz State
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [quizResultSummary, setQuizResultSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoding = async () => {
      try {
        const res = await api.getCodingProblems();
        setCodingProblems(res.problems || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoding();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStartQuiz = async () => {
    try {
      setLoading(true);
      const res = await api.getPracticeQuiz({ topic, difficulty, count: questionCount });
      if (res.quiz && res.quiz.length > 0) {
        setQuizQuestions(res.quiz);
        setCurrentIndex(0);
        setUserAnswers({});
        setRevealedAnswers({});
        setTimerSeconds(0);
        setIsTimerRunning(true);
        setMode('quiz');
      } else {
        alert('No questions found for this topic/difficulty. Try selecting All.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelfGrade = (knowsAnswer: boolean) => {
    setUserAnswers({ ...userAnswers, [currentIndex]: knowsAnswer });
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishQuiz({ ...userAnswers, [currentIndex]: knowsAnswer });
    }
  };

  const handleFinishQuiz = async (finalAnswers: Record<number, boolean>) => {
    setIsTimerRunning(false);
    const correctCount = Object.values(finalAnswers).filter(Boolean).length;
    const total = quizQuestions.length;
    const scorePct = Math.round((correctCount / total) * 100);

    try {
      const res = await api.submitPracticeQuiz({
        topic,
        difficulty,
        total_questions: total,
        correct_answers: correctCount,
        time_taken_seconds: timerSeconds,
        weak_topics: scorePct < 70 ? [topic] : []
      });

      setQuizResultSummary({
        correctCount,
        total,
        scorePct,
        timeTaken: timerSeconds,
        accuracy: `${scorePct}%`
      });

      setMode('quiz_result');

      if (scorePct >= 80) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Hub View */}
      {mode === 'hub' && (
        <div className="space-y-8">
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Interactive Practice Arena
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Practice Quizzes & Coding Challenges
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Test your technical interview knowledge with timed adaptive drills, or jump into the coding sandbox to solve algorithmic problems with live test case verification.
            </p>
          </div>

          {/* Quick Drill Generator Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  <span>Start a Custom Placement Drill</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select your topic and test yourself against frequently reported interview questions with timer tracking.
                </p>
              </div>

              <button
                onClick={handleStartQuiz}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
              >
                <Zap className="w-4 h-4" />
                <span>{loading ? 'Generating Drill...' : 'Launch Practice Drill'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                >
                  {['DSA', 'SQL', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP', 'Web Development', 'HR & Behavioral'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="All">Mixed (All Levels)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Question Count</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                >
                  <option value={5}>5 Questions (Quick Check)</option>
                  <option value={10}>10 Questions (Standard Sprint)</option>
                  <option value={15}>15 Questions (Deep Drill)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Coding Practice Problems Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  <span>Algorithmic Coding Practice (Sandbox Runner)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Write JavaScript solutions and test them against automated test cases in real-time.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {codingProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {prob.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-medium">
                        {prob.topic}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2">{prob.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {prob.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Asked in: {prob.companies?.split(',').slice(0, 2).join(', ')}
                    </span>

                    <Link
                      to={`/practice/coding/${prob.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-all"
                    >
                      <span>Solve Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Active Quiz Mode */}
      {mode === 'quiz' && quizQuestions.length > 0 && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Header Progress & Timer */}
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">
                Question {currentIndex + 1} of {quizQuestions.length}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-sky-400 font-medium">{topic} ({difficulty})</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTime(timerSeconds)}</span>
            </div>
          </div>

          {/* Current Question Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {quizQuestions[currentIndex].question_type}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {quizQuestions[currentIndex].question}
              </h2>
            </div>

            {/* Hint / Strategy */}
            {quizQuestions[currentIndex].interview_tip && (
              <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 font-semibold block mb-0.5">Interview Tip:</strong>
                  <span>{quizQuestions[currentIndex].interview_tip}</span>
                </div>
              </div>
            )}

            {/* Solution Toggle */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setRevealedAnswers({ ...revealedAnswers, [currentIndex]: !revealedAnswers[currentIndex] })}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-sky-400 font-medium border border-slate-700 transition-colors"
              >
                {revealedAnswers[currentIndex] ? 'Hide Explanation' : 'Reveal Model Answer'}
              </button>

              {revealedAnswers[currentIndex] && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
                  {quizQuestions[currentIndex].answer}
                </div>
              )}
            </div>

            {/* Self-Grading Buttons */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">Did you recall this concept accurately?</span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleSelfGrade(false)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold"
                >
                  Need Revision (0/1)
                </button>
                <button
                  onClick={() => handleSelfGrade(true)}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-semibold"
                >
                  Mastered (1/1)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Quiz Results Summary */}
      {mode === 'quiz_result' && quizResultSummary && (
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-sky-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">Practice Drill Completed!</h2>
            <p className="text-xs text-slate-400">Here is your technical recall performance breakdown.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Accuracy</span>
              <strong className="text-xl text-emerald-400">{quizResultSummary.scorePct}%</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Correct</span>
              <strong className="text-xl text-white">{quizResultSummary.correctCount} / {quizResultSummary.total}</strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Time Taken</span>
              <strong className="text-xl text-sky-400">{formatTime(quizResultSummary.timeTaken)}</strong>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setMode('hub')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Back to Practice Arena
            </button>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
            >
              View Readiness Dashboard
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
