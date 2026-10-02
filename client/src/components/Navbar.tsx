import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import {
  Briefcase,
  BookOpen,
  Code2,
  Bot,
  Compass,
  FileText,
  Bookmark,
  LayoutDashboard,
  ShieldAlert,
  Search,
  LogOut,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const navLinks = [
    { name: 'Companies', path: '/companies', icon: Briefcase },
    { name: 'Questions', path: '/questions', icon: BookOpen },
    { name: 'Practice & Code', path: '/practice', icon: Code2 },
    { name: 'AI Mock', path: '/mock-interview', icon: Bot, highlight: true },
    { name: 'Roadmap', path: '/roadmap', icon: Compass },
    { name: 'Resume AI', path: '/resume-ai', icon: FileText },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#07090E]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-sky-500/25 group-hover:shadow-sky-500/50 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#07090E] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                Placement<span className="gradient-text font-black">Guide</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30">PRO</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">AI Placement Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/[0.06]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    active
                      ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-purple-400' : ''}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons: Search + Theme Switcher + Auth */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search Shortcut */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-sm"
              title="Global Search"
            >
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">⌘K</kbd>
            </button>

            {/* Dynamic Theme Switcher */}
            <ThemeSwitcher />

            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition-all shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 flex items-center justify-center text-[10px] font-black text-slate-950">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[85px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Sign Out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* 1-Click Demo Buttons */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-xl border border-slate-700/80 text-[11px]">
                  <button
                    onClick={() => demoLogin('student')}
                    className="px-2 py-1 text-slate-300 hover:text-sky-300 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                  >
                    Student Demo
                  </button>
                  <span className="text-slate-700">|</span>
                  <button
                    onClick={() => demoLogin('admin')}
                    className="px-2 py-1 text-slate-300 hover:text-purple-300 hover:bg-slate-800 rounded-lg font-medium transition-colors"
                  >
                    Admin Demo
                  </button>
                </div>

                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white btn-gradient rounded-xl transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active ? 'bg-sky-500/15 text-sky-300 border border-sky-500/20' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          {!user && (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  demoLogin('student');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs text-sky-300 bg-sky-500/10 rounded-xl font-semibold border border-sky-500/20"
              >
                Quick Login as Demo Student
              </button>
              <button
                onClick={() => {
                  demoLogin('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2 text-xs text-purple-300 bg-purple-500/10 rounded-xl font-semibold border border-purple-500/20"
              >
                Quick Login as Demo Admin
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
