import React from 'react';
import { Layers, Search, Car, Users, Calendar } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Layers,
  title = 'No Records Found',
  description = 'Try refining your search keyword or clearing active filter options.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="py-16 px-6 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-4 max-w-lg mx-auto my-6 animate-fadeIn">
      <div className="w-16 h-16 bg-slate-800/80 border border-slate-700/60 text-slate-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
