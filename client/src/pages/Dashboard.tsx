import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ProgressBar } from '../components/ProgressBar';
import {
  LayoutDashboard,
  Flame,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  BookOpen,
  Bot,
  Code2,
  Compass,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Daily task checkboxes local state
  const [dailyTasks, setDailyTasks] = useState([
    { id: 1, text: 'Solve 2 DSA Problems (Two Sum & Valid Parentheses)', completed: true },
    { id: 2, text: 'Practice 5 SQL Queries (Joins & Normalization)', completed: true },
    { id: 3, text: 'Review Operating Systems Concurrency & Deadlocks', completed: false },
    { id: 4, text: 'Take a 30-min AI Mock Interview for Amazon', completed: false }
  ]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await api.getProgress();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const toggleDailyTask = (id: number) => {
    setDailyTasks(dailyTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Sparkles className="w-6 h-6 text-sky-400 animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading placement preparation analytics...</p>
      </div>
    );
  }

  const readinessScore = data?.overallReadiness || 72;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Greeting & Streak */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" /> Placement Analytics & Readiness
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back, {user?.name || 'Candidate'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeting: <strong className="text-slate-200">{user?.target_role || 'Software Development Engineer'}</strong> at {user?.target_companies || 'Top Product Tech'}
          </p>
        </div>

        {/* Daily Streak Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 px-4 py-2.5 rounded-2xl self-start sm:self-auto shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="text-xs text-orange-300 font-bold flex items-center gap-1">
              <span>{data?.streakDays || 14} Days Placement Streak</span>
              <span>🔥</span>
            </div>
            <span className="text-[11px] text-slate-400">Keep up the daily consistency!</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Questions Solved</span>
          </span>
          <div className="text-2xl font-bold text-white">
            {data?.totalQuestionsCompleted || 24}
            <span className="text-xs text-slate-500 font-normal ml-1">/ 500+</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>Mock Score Avg</span>
          </span>
          <div className="text-2xl font-bold text-purple-400">
            {data?.avgMockScore || 76}%
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Coding Problems</span>
          </span>
          <div className="text-2xl font-bold text-emerald-400">
            {data?.codingProblemsCount || 4} Solved
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Placement Readiness</span>
          </span>
          <div className="text-2xl font-bold text-amber-400">
            {readinessScore}%
          </div>
        </div>
      </div>

      {/* 3. Main Progress Meter & Daily Action Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Overall Readiness & Topic Breakdown (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span>Overall Placement Readiness Assessment</span>
            </h3>
            <span className="text-xs font-bold text-emerald-400">{readinessScore}% Ready</span>
          </div>

          <ProgressBar
            progress={readinessScore}
            size="lg"
            color="sky"
            label="Holistic Readiness Score"
            sublabel={`${readinessScore}%`}
          />

          {/* Domain Breakdown Bars */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Technical Domain Progress
            </h4>
            <div className="space-y-3">
              {data?.topicBreakdown?.map((t: any, i: number) => (
                <ProgressBar
                  key={i}
                  label={t.topic}
                  sublabel={`${t.percentage}%`}
                  progress={t.percentage}
                  size="sm"
                  color={t.percentage > 70 ? 'emerald' : t.percentage > 40 ? 'indigo' : 'amber'}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Today's Tasks & Weak Areas (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Today's Tasks */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Today's Placement Tasks</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {dailyTasks.filter(t => t.completed).length}/{dailyTasks.length} Done
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {dailyTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleDailyTask(t.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    t.completed
                      ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    t.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'
                  }`}>
                    {t.completed && <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-slate-950" />}
                  </div>
                  <span className={`leading-relaxed ${t.completed ? 'line-through text-slate-400' : ''}`}>
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weak Areas Alerts */}
          <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 space-y-3">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Identified Weak Areas</span>
            </h3>
            <div className="space-y-2 text-xs">
              {data?.weakAreas?.map((wa: any, idx: number) => (
                <div key={idx} className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-rose-300 font-semibold">{wa.topic}</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      {wa.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{wa.reason}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. Weekly Activity Chart */}
      {data?.weeklyActivity && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Weekly Placement Study Activity (Questions Solved vs Mock Mins)</span>
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="questions" name="Questions Solved" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mockMins" name="Mock Practice (Mins)" fill="#818CF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 5. Recommended Next Steps */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Recommended Next Actions for Placement Readiness</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {data?.recommendedNextSteps?.map((step: string, i: number) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-slate-200 leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
