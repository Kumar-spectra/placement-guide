import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, Question } from '../services/api';
import {
  BookOpen,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  Building2,
  Code2,
  ArrowLeft,
  Share2,
  Flame,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const QuestionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.getQuestionDetails(id);
        if (res.question) {
          setQuestion(res.question);
          setCompleted(res.question.progress_status === 'completed');
          setBookmarked(Boolean(res.question.is_bookmarked));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleToggleComplete = async () => {
    if (!question) return;
    try {
      const res = await api.toggleQuestionProgress(question.id);
      setCompleted(res.completed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!question) return;
    try {
      const res = await api.toggleBookmark('question', question.id);
      setBookmarked(res.bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Sparkles className="w-6 h-6 text-sky-400 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading comprehensive solution...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Question not found</h2>
        <Link to="/questions" className="text-xs text-sky-400 mt-2 inline-block">
          ← Back to Question Bank
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        to="/questions"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Question Bank</span>
      </Link>

      {/* Main Question Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        
        {/* Header Tags & Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {question.topic}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              {question.difficulty}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              {question.question_type}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                completed
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completed ? 'Completed' : 'Mark Completed'}</span>
            </button>

            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-lg border transition-all ${
                bookmarked
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-relaxed">
          {question.question}
        </h1>

        {/* Reported Companies List */}
        {question.linked_companies && question.linked_companies.length > 0 && (
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Reported Placement Frequency & Companies:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {question.linked_companies.map((c) => (
                <Link
                  key={c.id}
                  to={`/company/${c.slug}`}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition-colors"
                >
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-[10px] text-amber-400">({c.report_count} reports)</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Interview Strategy Tip */}
        {question.interview_tip && (
          <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-400 font-bold block mb-1">Interview Answering Strategy:</strong>
              <span>{question.interview_tip}</span>
            </div>
          </div>
        )}

        {/* Detailed Explanation */}
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Comprehensive Answer</span>
          </h2>

          <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            {question.answer}
          </div>
        </div>

        {/* Code Snippet if applicable */}
        {question.code_snippet && (
          <div className="space-y-2 pt-2">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Code Demonstration</span>
            </h2>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto font-mono text-xs text-sky-300 leading-normal">
              <pre>{question.code_snippet}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Related Questions */}
      {question.related_questions && question.related_questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">Related {question.topic} Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.related_questions.map((rq) => (
              <Link
                key={rq.id}
                to={`/questions/${rq.id}`}
                className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-400 transition-colors line-clamp-2">
                  {rq.question}
                </div>
                <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800">{rq.difficulty}</span>
                  <span>•</span>
                  <span>{rq.question_type}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
