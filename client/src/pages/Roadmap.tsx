import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  Briefcase,
  Clock,
  PlusCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Roadmap: React.FC = () => {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Generator form
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Development Engineer');
  const [targetCompanies, setTargetCompanies] = useState(user?.target_companies || 'Amazon, Microsoft, Google, TCS');
  const [durationDays, setDurationDays] = useState(60);
  const [currentLevel, setCurrentLevel] = useState(user?.preparation_level || 'Intermediate');

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const res = await api.getRoadmaps();
      if (res.roadmaps && res.roadmaps.length > 0) {
        setRoadmaps(res.roadmaps);
        setSelectedRoadmap(res.roadmaps[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      const res = await api.generateRoadmap({
        targetRole,
        targetCompanies,
        durationDays,
        currentLevel
      });
      if (res.roadmap) {
        setRoadmaps([res.roadmap, ...roadmaps]);
        setSelectedRoadmap(res.roadmap);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate roadmap.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!selectedRoadmap) return;
    try {
      const res = await api.toggleRoadmapTask(selectedRoadmap.id, taskId);
      if (res.weeks) {
        const updated = { ...selectedRoadmap, weeks: res.weeks };
        setSelectedRoadmap(updated);
        setRoadmaps(roadmaps.map(r => r.id === updated.id ? updated : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate completion percentage
  const calculateProgress = (weeks: any[]) => {
    if (!weeks || weeks.length === 0) return 0;
    let total = 0;
    let completed = 0;
    weeks.forEach(w => {
      w.tasks.forEach((t: any) => {
        total++;
        if (t.completed) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" /> Structured Placement Trajectory
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Personalized Placement Roadmaps
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Convert your target companies and preparation timeline into week-by-week actionable study tasks with progress tracking.
        </p>
      </div>

      {/* Generator Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Generate AI Tailored Placement Roadmap</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customizes weekly curriculum from basic DSA algorithms to advanced mock sprints based on your target date.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateRoadmap} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
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

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Target Companies</label>
            <input
              type="text"
              value={targetCompanies}
              onChange={(e) => setTargetCompanies(e.target.value)}
              placeholder="e.g. Amazon, Google, TCS"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Preparation Duration</label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
            >
              <option value={30}>30 Days (Fast Sprint)</option>
              <option value={60}>60 Days (Recommended)</option>
              <option value={90}>90 Days (Complete Master)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Build Roadmap'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Roadmap View */}
      {selectedRoadmap && (
        <div className="space-y-6">
          
          {/* Roadmap Header & Progress Meter */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {selectedRoadmap.duration_days} Days Curriculum
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                  {selectedRoadmap.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target: <strong className="text-slate-200">{selectedRoadmap.target_companies}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Curriculum Completion</span>
                  <strong className="text-lg text-emerald-400 font-bold">
                    {calculateProgress(selectedRoadmap.weeks)}%
                  </strong>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${calculateProgress(selectedRoadmap.weeks)}%` }}
              />
            </div>
          </div>

          {/* Week by Week Task Cards */}
          <div className="space-y-4">
            {selectedRoadmap.weeks?.map((weekData: any, wIndex: number) => {
              const weekCompletedCount = weekData.tasks?.filter((t: any) => t.completed).length || 0;
              const weekTotal = weekData.tasks?.length || 1;
              const isWeekDone = weekCompletedCount === weekTotal;

              return (
                <div
                  key={wIndex}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    isWeekDone ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isWeekDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-amber-400'
                      }`}>
                        W{weekData.week || (wIndex + 1)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{weekData.title}</h4>
                        <p className="text-xs text-slate-400">{weekData.focus}</p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                      {weekCompletedCount}/{weekTotal} tasks
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {weekData.tasks?.map((task: any) => (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                          task.completed
                            ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600'
                        }`}>
                          {task.completed && <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" />}
                        </div>
                        <span className={`leading-relaxed ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
