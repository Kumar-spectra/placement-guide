import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'sky' | 'indigo' | 'emerald' | 'amber' | 'purple';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  sublabel,
  size = 'md',
  color = 'sky'
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }[size];

  const colorClass = {
    sky: 'bg-gradient-to-r from-sky-500 to-indigo-500 shadow-sky-500/20',
    indigo: 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-indigo-500/20',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/20'
  }[color];

  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          {label && <span className="text-slate-300">{label}</span>}
          {sublabel && <span className="text-slate-400 font-semibold">{sublabel}</span>}
        </div>
      )}
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heightClass} p-0.5 border border-slate-700/50`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
