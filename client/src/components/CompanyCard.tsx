import React from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../services/api';
import { CompanyLogo } from './CompanyLogo';
import { Briefcase, ArrowRight, Layers, HelpCircle, Building2, Users } from 'lucide-react';

interface CompanyCardProps {
  company: Company;
  isBookmarked?: boolean;
  onToggleBookmark?: (e: React.MouseEvent) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  isBookmarked,
  onToggleBookmark
}) => {
  const getDifficultyConfig = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'hard':
        return { cls: 'badge-hard', label: 'Hard' };
      case 'medium-hard':
        return { cls: 'badge-medium', label: 'Medium-Hard' };
      case 'medium':
        return { cls: 'badge-medium', label: 'Medium' };
      default:
        return { cls: 'badge-easy', label: diff || 'Easy' };
    }
  };

  const diff = getDifficultyConfig(company.difficulty);

  return (
    <div className="glass-panel glass-panel-hover border-gradient rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden">
      {/* Subtle ambient glow in top-right */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl -z-10 group-hover:from-sky-500/20 transition-all duration-500" />

      <div>
        {/* Header: Real Logo + Name + Difficulty */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Real company logo via Clearbit */}
            <CompanyLogo
              name={company.name}
              slug={company.slug}
              logoUrl={company.logo_url}
              size="md"
              className="shadow-lg ring-1 ring-white/10"
            />
            <div>
              <Link to={`/company/${company.slug}`} className="hover:text-sky-400 transition-colors">
                <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  {company.name}
                </h3>
              </Link>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                <Building2 className="w-3 h-3 text-sky-400/70" />
                <span>{company.industry}</span>
              </p>
            </div>
          </div>

          <span className={`badge ${diff.cls} shrink-0`}>
            {diff.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {company.description}
        </p>

        {/* Key info */}
        <div className="space-y-2 mb-4 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-sky-400" />
              Roles:
            </span>
            <span className="font-semibold text-slate-200 truncate max-w-[160px] text-right" title={company.popular_roles}>
              {company.popular_roles?.split(',')[0]?.trim()}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Rounds:
            </span>
            <span className="font-semibold text-slate-200">
              {company.round_count || 4} Interview Rounds
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-400 font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <strong className="text-sky-300">{company.question_count || 12}+</strong>
            <span>Qs</span>
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Users className="w-3 h-3 text-slate-500" />
            {company.experience_count || 1} Exp
          </span>
        </div>

        <Link
          to={`/company/${company.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 group-hover:translate-x-1 transition-all"
        >
          <span>Prep Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
