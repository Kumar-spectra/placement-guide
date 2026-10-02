import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Question, api } from '../services/api';
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building2,
  Lightbulb,
  ExternalLink,
  Flame
} from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onToggleComplete?: (id: number) => void;
  onToggleBookmark?: (id: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onToggleComplete,
  onToggleBookmark
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completed, setCompleted] = useState(question.progress_status === 'completed');
  const [bookmarked, setBookmarked] = useState(Boolean(question.is_bookmarked));
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsToggling(true);
      const res = await api.toggleQuestionProgress(question.id);
      setCompleted(res.completed);
      if (onToggleComplete) onToggleComplete(question.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.toggleBookmark('question', question.id);
      setBookmarked(res.bookmarked);
      if (onToggleBookmark) onToggleBookmark(question.id);
    } catch (err) {
      console.error(err);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'hard':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'medium':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getFrequencyBadge = (freq?: string) => {
    if (freq === 'Frequently Reported') {
      return 'bg-gradient-to-r from-rose-500/20 to-orange-500/20 text-rose-300 border-rose-500/40 shadow-sm';
    }
    if (freq === 'Occasionally Reported') {
      return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 transition-all ${
        completed ? 'border-emerald-500/40 bg-emerald-950/15' : 'hover:border-slate-700/90'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox Complete Button */}
        <button
          onClick={handleToggleComplete}
          disabled={isToggling}
          className={`mt-0.5 p-1 rounded-xl transition-all flex-shrink-0 ${
            completed
              ? 'text-emerald-400 bg-emerald-500/20 hover:bg-emerald-500/30 scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
          title={completed ? 'Completed (Click to uncheck)' : 'Mark as Completed'}
        >
          <CheckCircle2 className={`w-5 h-5 ${completed ? 'fill-emerald-500/30' : ''}`} />
        </button>

        {/* Question Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(question.difficulty)}`}>
              {question.difficulty}
            </span>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-white/[0.08]">
              {question.topic}
            </span>

            {question.frequency_label && (
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${getFrequencyBadge(question.frequency_label)}`}>
                <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                <span>{question.frequency_label} {question.max_report_count ? `(${question.max_report_count}x)` : ''}</span>
              </span>
            )}
          </div>

          <Link
            to={`/questions/${question.id}`}
            className="text-sm font-bold text-slate-100 hover:text-sky-300 leading-snug transition-colors line-clamp-2"
          >
            {question.question}
          </Link>

          {/* Company Badges */}
          {question.companies && question.companies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3 text-sky-400" /> Reported in:
              </span>
              {question.companies.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/90 text-slate-300 border border-white/[0.08] font-semibold"
                >
                  {c}
                </span>
              ))}
              {question.companies.length > 4 && (
                <span className="text-[10px] text-slate-400 font-medium">+{question.companies.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleToggleBookmark}
            className={`p-1.5 rounded-xl transition-all ${
              bookmarked
                ? 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Save Question'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isExpanded ? 'Collapse' : 'Quick Answer'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Quick Answer Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 text-xs animate-in fade-in duration-200">
          {question.interview_tip && (
            <div className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl text-amber-200 flex items-start gap-2.5 shadow-sm">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-400 font-bold block mb-0.5">Interview Tip:</strong>
                <span className="leading-relaxed">{question.interview_tip}</span>
              </div>
            </div>
          )}

          <div className="bg-slate-950/80 p-4 rounded-xl border border-white/[0.06] text-slate-300 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-line font-normal">
            {question.answer}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              to={`/questions/${question.id}`}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
            >
              <span>View Full Explanation & Code Solutions</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
