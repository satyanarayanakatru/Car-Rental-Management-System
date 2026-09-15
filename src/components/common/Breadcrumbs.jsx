import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap = {
  dashboard: 'Dashboard',
  cars: 'Car Inventory',
  customers: 'Customers',
  rent: 'New Rental Booking',
  bookings: 'Booking History',
  availability: 'Car Availability',
  reports: 'Reports & Analytics'
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 py-1" aria-label="Breadcrumb">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-slate-400 hover:text-indigo-400 transition font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[value.toLowerCase()] || value;

        return (
          <div key={to} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            {isLast ? (
              <span className="font-bold text-white truncate max-w-[150px] sm:max-w-xs">{displayName}</span>
            ) : (
              <Link to={to} className="text-slate-400 hover:text-indigo-400 transition font-medium">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
