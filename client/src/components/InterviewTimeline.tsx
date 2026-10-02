import React from 'react';
import { Round } from '../services/api';
import { Terminal, Code, MessageSquare, Award, CheckCircle, Lightbulb, HelpCircle } from 'lucide-react';

interface InterviewTimelineProps {
  rounds: Round[];
}

export const InterviewTimeline: React.FC<InterviewTimelineProps> = ({ rounds }) => {
  const getRoundIcon = (name: string, index: number) => {
    const lower = name.toLowerCase();
    if (lower.includes('online') || lower.includes('oa') || lower.includes('assessment')) {
      return <Terminal className="w-4 h-4 text-sky-400" />;
    }
    if (lower.includes('technical') || lower.includes('coding') || lower.includes('dsa')) {
      return <Code className="w-4 h-4 text-indigo-400" />;
    }
    if (lower.includes('system') || lower.includes('project') || lower.includes('design')) {
      return <Award className="w-4 h-4 text-purple-400" />;
    }
    return <MessageSquare className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Horizontal Step Visual */}
      <div className="hidden md:flex items-center justify-between relative py-4 px-2">
        <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
        {rounds.map((round, idx) => (
          <div key={round.id || idx} className="relative z-10 flex flex-col items-center text-center max-w-[160px]">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-sky-500/40 flex items-center justify-center shadow-lg shadow-sky-500/10 mb-2">
              {getRoundIcon(round.name, idx)}
            </div>
            <span className="text-xs font-bold text-white line-clamp-1">{round.name.split(':')[0]}</span>
            <span className="text-[10px] text-slate-400">{round.difficulty}</span>
          </div>
        ))}
      </div>

      {/* Detailed Vertical Cards */}
      <div className="space-y-4">
        {rounds.map((round, index) => (
          <div
            key={round.id || index}
            className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                  {getRoundIcon(round.name, index)}
                </div>
                <h4 className="text-sm font-bold text-slate-100">{round.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Difficulty: {round.difficulty}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {round.question_types}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {round.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <strong className="text-slate-400 font-semibold block mb-1">Typical Topics:</strong>
                <p className="text-slate-200">{round.typical_topics}</p>
              </div>

              {round.preparation_tips && (
                <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/20 text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400 font-semibold block mb-0.5">Preparation Strategy:</strong>
                    <span>{round.preparation_tips}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
