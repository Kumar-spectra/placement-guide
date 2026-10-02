import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Sparkles, CheckCircle2, Briefcase, GraduationCap, Building2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    degree: user?.degree || 'B.Tech',
    branch: user?.branch || 'Computer Science & Engineering',
    graduation_year: user?.graduation_year || 2026,
    target_role: user?.target_role || 'Software Development Engineer',
    target_companies: user?.target_companies || 'Amazon, Google, Microsoft, TCS',
    skills: user?.skills || 'JavaScript, React, Node.js, Python, SQL, DSA',
    preparation_level: user?.preparation_level || 'Intermediate'
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        degree: user.degree || 'B.Tech',
        branch: user.branch || 'Computer Science & Engineering',
        graduation_year: user.graduation_year || 2026,
        target_role: user.target_role || 'Software Development Engineer',
        target_companies: user.target_companies || 'Amazon, Google, Microsoft, TCS',
        skills: user.skills || 'JavaScript, React, Node.js, Python, SQL, DSA',
        preparation_level: user.preparation_level || 'Intermediate'
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateProfile(formData);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Candidate Settings
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Placement Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Customize your academic background, target roles, dream companies, and current skill ratings to receive tailored placement roadmaps and questions.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        
        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Degree & Branch</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="e.g. B.Tech / MCA"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                />
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="e.g. CSE / IT / ECE"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Graduation Batch Year</label>
              <input
                type="number"
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Placement Role</label>
              <input
                type="text"
                value={formData.target_role}
                onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                placeholder="e.g. SDE-1 / Software Developer"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Target Companies (Comma separated)</label>
              <input
                type="text"
                value={formData.target_companies}
                onChange={(e) => setFormData({ ...formData, target_companies: e.target.value })}
                placeholder="e.g. Amazon, Google, Microsoft, TCS"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Current Technical Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g. JavaScript, React, Node.js, Python, SQL, DSA, Docker"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Self-Assessed Preparation Level</label>
            <select
              value={formData.preparation_level}
              onChange={(e) => setFormData({ ...formData, preparation_level: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200"
            >
              <option value="Beginner">Beginner (Starting fresh on DSA & Core CS)</option>
              <option value="Intermediate">Intermediate (Comfortable with basic DSA, need speed & system depth)</option>
              <option value="Advanced">Advanced (Solving Hard problems, ready for mock interview sprints)</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
