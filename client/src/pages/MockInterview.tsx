import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api, Question } from '../services/api';
import {
  Bot,
  Mic,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  Lightbulb,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MockInterview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCompany = searchParams.get('company') || 'Amazon';

  // Config State
  const [stage, setStage] = useState<'setup' | 'interview' | 'scorecard'>('setup');
  const [companyName, setCompanyName] = useState(initialCompany);
  const [roleName, setRoleName] = useState('Software Development Engineer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(3);

  // Active Session State
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [finalScorecard, setFinalScorecard] = useState<any>(null);

  const handleStartSession = async () => {
    try {
      setEvaluating(true);
      const res = await api.startMockInterview({
        companyName,
        roleName,
        interviewType,
        difficulty,
        questionCount
      });
      if (res.questions && res.questions.length > 0) {
        setSessionId(res.sessionId);
        setQuestions(res.questions);
        setCurrentIndex(0);
        setCurrentAnswer('');
        setEvaluations([]);
        setStage('interview');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to initialize AI Mock session.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert('Please enter your answer to the AI interviewer.');
      return;
    }

    try {
      setEvaluating(true);
      const currentQ = questions[currentIndex];
      const res = await api.evaluateMockAnswer({
        question: currentQ.question,
        userAnswer: currentAnswer,
        topic: currentQ.topic,
        difficulty,
        companyName,
        roleName
      });

      const updatedEvals = [
        ...evaluations,
        {
          question: currentQ.question,
          answer: currentAnswer,
          evaluation: res.evaluation
        }
      ];
      setEvaluations(updatedEvals);
      setCurrentAnswer('');

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Compute overall scorecard
        handleFinishInterview(updatedEvals);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to evaluate answer.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleFinishInterview = async (allEvals: any[]) => {
    const totalEvals = allEvals.length || 1;
    let sumConcept = 0;
    let sumComm = 0;
    let sumComp = 0;
    let sumTech = 0;
    let sumProb = 0;
    let sumOverall = 0;
    const allStrengths: string[] = [];
    const allWeakAreas: string[] = [];
    const allSuggestions: string[] = [];

    allEvals.forEach(e => {
      const ev = e.evaluation;
      sumConcept += ev.conceptAccuracy || 70;
      sumComm += ev.communicationScore || 70;
      sumComp += ev.completenessScore || 70;
      sumTech += ev.technicalDepth || 70;
      sumProb += ev.problemSolving || 70;
      sumOverall += ev.overallScore || 70;

      if (ev.strengths) allStrengths.push(...ev.strengths);
      if (ev.weakAreas) allWeakAreas.push(...ev.weakAreas);
      if (ev.improvementSuggestions) allSuggestions.push(...ev.improvementSuggestions);
    });

    const scorecard = {
      overallScore: Math.round(sumOverall / totalEvals),
      conceptAccuracy: Math.round(sumConcept / totalEvals),
      communicationScore: Math.round(sumComm / totalEvals),
      completenessScore: Math.round(sumComp / totalEvals),
      technicalDepth: Math.round(sumTech / totalEvals),
      problemSolving: Math.round(sumProb / totalEvals),
      strengths: Array.from(new Set(allStrengths)).slice(0, 4),
      weakAreas: Array.from(new Set(allWeakAreas)).slice(0, 4),
      improvementSuggestions: Array.from(new Set(allSuggestions)).slice(0, 4),
      recommendedTopics: [questions[0]?.topic || 'DSA', 'System Architecture', 'Time Complexity'],
      evaluations: allEvals
    };

    setFinalScorecard(scorecard);
    setStage('scorecard');

    if (scorecard.overallScore >= 75) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }

    try {
      await api.finishMockInterview({
        companyName,
        roleName,
        interviewType,
        difficulty,
        ...scorecard,
        transcript: allEvals
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Setup Stage */}
      {stage === 'setup' && (
        <div className="space-y-6">
          <div>
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5" /> AI Technical & Behavioral Simulator
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              AI Mock Interview
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Simulate a real-world placement interview tailored to your target company. The AI evaluator analyzes your concept accuracy, communication structure, completeness, and technical depth.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>Configure Interview Session</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Company</label>
                <select
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                >
                  {['Amazon', 'Google', 'Microsoft', 'TCS', 'Infosys', 'Accenture', 'Deloitte', 'Oracle', 'Salesforce', 'Zoho', 'Uber', 'Meta'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Role</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Interview Round Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                >
                  <option value="Technical">Technical Round (DSA, Core CS, System Design)</option>
                  <option value="Behavioral">Behavioral / Leadership (STAR format)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Difficulty & Questions</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:border-sky-500"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-purple-200 text-xs flex items-start gap-3">
              <Bot className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-purple-300 font-bold block mb-0.5">Evaluation Rubric:</strong>
                <span>The AI will rate your responses across 5 dimensions: Concept Accuracy, Communication, Technical Depth, Completeness, and Problem Solving.</span>
              </div>
            </div>

            <button
              onClick={handleStartSession}
              disabled={evaluating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-5 h-5" />
              <span>{evaluating ? 'Initializing AI Interviewer...' : 'Start Live AI Interview Session'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Live Interview Question & Answer Stage */}
      {stage === 'interview' && questions.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Progress */}
          <div className="glass-panel p-4 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                {currentIndex + 1}
              </div>
              <span className="font-semibold text-slate-200">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-sky-400 font-medium">{companyName} ({roleName})</span>
            </div>

            <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              {questions[currentIndex].topic}
            </span>
          </div>

          {/* AI Question Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/30 space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Bot className="w-4 h-4" />
              <span>AI Lead Interviewer</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              "{questions[currentIndex].question}"
            </h2>

            {questions[currentIndex].interview_tip && (
              <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Tip: Structure your response with a clear definition, trade-offs, and examples.</span>
              </div>
            )}
          </div>

          {/* User Answer Editor */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Your Response:</span>
              <span>Type or dictate your structured answer</span>
            </div>

            <textarea
              rows={8}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Explain your approach clearly. Mention key algorithms, schema details, time/space complexity, or STAR points..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Word Count: {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                onClick={handleSubmitAnswer}
                disabled={evaluating || !currentAnswer.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {evaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AI Evaluating Response...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Next Question</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Comprehensive Scorecard Stage */}
      {stage === 'scorecard' && finalScorecard && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main Score Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 text-center space-y-6 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 flex items-center justify-center mx-auto text-white shadow-2xl shadow-purple-500/30">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Interview Performance Assessment
              </span>
              <h1 className="text-3xl font-extrabold text-white">
                {companyName} {roleName} Scorecard
              </h1>
              <p className="text-xs text-slate-400">
                Overall AI Interview Readiness Score: <strong className="text-2xl text-emerald-400 font-bold ml-1">{finalScorecard.overallScore}%</strong>
              </p>
            </div>

            {/* 5 Dimensions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <div className="p-2">
                <span className="text-slate-400 block mb-1 text-[11px]">Concept Accuracy</span>
                <strong className="text-lg text-sky-400">{finalScorecard.conceptAccuracy}%</strong>
              </div>
              <div className="p-2">
                <span className="text-slate-400 block mb-1 text-[11px]">Communication</span>
                <strong className="text-lg text-indigo-400">{finalScorecard.communicationScore}%</strong>
              </div>
              <div className="p-2">
                <span className="text-slate-400 block mb-1 text-[11px]">Technical Depth</span>
                <strong className="text-lg text-purple-400">{finalScorecard.technicalDepth}%</strong>
              </div>
              <div className="p-2">
                <span className="text-slate-400 block mb-1 text-[11px]">Completeness</span>
                <strong className="text-lg text-teal-400">{finalScorecard.completenessScore}%</strong>
              </div>
              <div className="p-2 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block mb-1 text-[11px]">Problem Solving</span>
                <strong className="text-lg text-emerald-400">{finalScorecard.problemSolving}%</strong>
              </div>
            </div>
          </div>

          {/* Strengths & Weak Areas Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Strengths */}
            <div className="glass-panel p-5 rounded-xl border border-emerald-500/20 space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </h3>
              <ul className="space-y-2 text-slate-300">
                {finalScorecard.strengths.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weak Areas & Next Steps */}
            <div className="glass-panel p-5 rounded-xl border border-amber-500/20 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </h3>
              <ul className="space-y-2 text-slate-300">
                {finalScorecard.weakAreas.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setStage('setup');
                setFinalScorecard(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Take Another Mock Interview</span>
            </button>

            <Link
              to="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-sky-500/20 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>View Readiness Dashboard</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
