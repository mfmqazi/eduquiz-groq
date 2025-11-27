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
      <nav className="glass-panel !rounded-none !border-x-0 !border-t-0 !p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-2">
            <BookOpen className="text-indigo-400" />
            <span>EduQuiz</span>
          </Link>

          {currentUser && (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex gap-4">
                <Link 
                  to="/" 
                  className={`flex items-center gap-2 transition-colors ${isActive('/') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link 
                  to="/history" 
                  className={`flex items-center gap-2 transition-colors ${isActive('/history') ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                >
                  <History size={18} />
                  History
                </Link>
              </div>
              
              <div className="flex items-center gap-4 pl-6 border-l border-slate-700">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-white">
                    {userData?.firstName} {userData?.lastName}
                  </div>
                  <div className="text-xs text-slate-400">@{userData?.username}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full hover:bg-slate-700/50 text-slate-300 hover:text-red-400 transition-all"
                  title="Log Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          )}
          
          {!currentUser && (
            <div className="flex gap-4">
              <Link to="/login" className="text-slate-300 hover:text-white font-medium">Log In</Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-grow container mx-auto py-8 px-4">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} EduQuiz Platform. All rights reserved.
      </footer>
    </div>
  );
}
