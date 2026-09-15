import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, Users, Key, Clock, ShieldCheck, LogOut, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Car Fleet', path: '/cars', icon: Car },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Rent a Car', path: '/rent', icon: Key },
    { name: 'Booking History', path: '/bookings', icon: Clock },
    { name: 'Car Availability', path: '/availability', icon: ShieldCheck }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-white tracking-wider flex items-center gap-1">
                SATYA <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </h1>
              <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest">Car Rentals</p>
            </div>
          </div>
        </div>

        {/* User Card Summary */}
        <div className="p-4 mx-3 my-4 bg-slate-800/60 border border-slate-700/50 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-white truncate">{user?.name || 'Manager'}</h4>
            <p className="text-xs text-indigo-400 flex items-center gap-1 truncate">
              <Shield className="w-3 h-3" /> {user?.role || 'Fleet Manager'}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 font-semibold shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-700/60 hover:border-rose-800/50 text-slate-300 font-medium rounded-xl text-sm transition duration-200 group"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
