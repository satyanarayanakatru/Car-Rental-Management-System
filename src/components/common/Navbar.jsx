import React from 'react';
import { Menu, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Breadcrumbs from './Breadcrumbs';

const Navbar = ({ setMobileOpen, pageTitle }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden transition"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-white tracking-tight">{pageTitle}</h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Operational
            </span>
          </div>
          <Breadcrumbs />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>System V2.4</span>
        </div>

        {/* Notification Icon */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
