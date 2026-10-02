import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Palette, Check, Sparkles, Moon, Sun, Terminal } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const themes: { id: ThemeMode; name: string; icon: string; preview: string; description: string }[] = [
    {
      id: 'cosmic-dark',
      name: 'Cosmic Nebula',
      icon: '🌌',
      preview: 'from-sky-500 via-indigo-500 to-purple-500',
      description: 'Deep obsidian with radiant sky and indigo aurora'
    },
    {
      id: 'midnight-cyber',
      name: 'Midnight Cyber',
      icon: '⚡',
      preview: 'from-emerald-400 via-teal-400 to-lime-400',
      description: 'Onyx dark with neon cyber emerald and lime glow'
    },
    {
      id: 'royal-amethyst',
      name: 'Royal Amethyst',
      icon: '🔮',
      preview: 'from-purple-500 via-fuchsia-500 to-indigo-500',
      description: 'Rich plum dark with vibrant violet and rose accents'
    },
    {
      id: 'clean-light',
      name: 'Clean Light',
      icon: '☀️',
      preview: 'from-sky-600 via-indigo-600 to-purple-600',
      description: 'Crisp porcelain slate with high-contrast typography'
    }
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 transition-all shadow-sm"
        title="Change UI Theme"
      >
        <span className="text-sm">{currentThemeObj.icon}</span>
        <span className="hidden sm:inline text-[11px] font-semibold">{currentThemeObj.name}</span>
        <Palette className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-2 shadow-2xl border border-slate-700/80 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-200 block">Select Theme & Aesthetic</span>
            <span className="text-[11px] text-slate-400">Custom tailored developer colorways</span>
          </div>

          <div className="p-1 space-y-1 mt-1">
            {themes.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-sky-500/10 border border-sky-500/30 text-white shadow-sm'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${t.preview} flex items-center justify-center text-xs text-white shadow-sm`}>
                      {t.icon}
                    </div>
                    <div>
                      <span className="text-xs font-semibold block leading-tight">{t.name}</span>
                      <span className="text-[10px] text-slate-400 block line-clamp-1">{t.description}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
