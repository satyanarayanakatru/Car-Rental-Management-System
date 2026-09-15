import React from 'react';
import { CheckCircle2, Clock, Wrench } from 'lucide-react';

const StatusBadge = ({ status, showIcon = true, size = 'sm' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Booked':
      case 'Rented':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Maintenance':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getIcon = () => {
    if (!showIcon) return null;
    switch (status) {
      case 'Available':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'Booked':
      case 'Rented':
        return <Clock className="w-3.5 h-3.5" />;
      case 'Maintenance':
        return <Wrench className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const sizeClasses = size === 'lg' ? 'px-3.5 py-1.5 text-xs' : 'px-3 py-1 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border backdrop-blur-md shadow-sm ${sizeClasses} ${getBadgeStyle()}`}
    >
      {status === 'Available' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
      )}
      {getIcon()}
      <span>{status === 'Booked' ? 'Rented' : status}</span>
    </span>
  );
};

export default StatusBadge;
