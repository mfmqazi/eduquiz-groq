import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, BookOpen, History, LayoutDashboard } from 'lucide-react';

export default function Layout({ children }) {
  const { currentUser, logout, userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error("Failed to log out");
    }
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate('/')}
          >
            <BookOpen size={28} strokeWidth={2.5} />
            <span className="text-2xl font-black tracking-tight">EduQuiz</span>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium text-sm backdrop-blur-sm"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-medium text-sm backdrop-blur-sm"
                >
                  <History size={18} />
                  History
                </button>
                <div className="h-8 w-px bg-white/20 mx-1 hidden md:block"></div>
                <div className="text-right mr-2 hidden sm:block">
                  <div className="text-sm font-bold">{currentUser.displayName || 'Student'}</div>
                  <div className="text-xs text-indigo-200">@{currentUser.email.split('@')[0]}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-bold text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 rounded-lg bg-white text-indigo-700 hover:bg-indigo-50 transition-all font-bold text-sm shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} EduQuiz Platform. All rights reserved.
      </footer>
    </div>
  );
}
