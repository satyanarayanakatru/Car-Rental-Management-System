import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 4 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {items.map((_, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-4 space-y-4">
            <div className="h-48 bg-slate-800 rounded-2xl w-full"></div>
            <div className="space-y-2">
              <div className="h-5 bg-slate-800 rounded-lg w-3/4"></div>
              <div className="h-3 bg-slate-800/80 rounded-lg w-full"></div>
              <div className="h-3 bg-slate-800/80 rounded-lg w-1/2"></div>
            </div>
            <div className="grid grid-cols-2 gap-2 py-2">
              <div className="h-8 bg-slate-800/60 rounded-xl"></div>
              <div className="h-8 bg-slate-800/60 rounded-xl"></div>
            </div>
            <div className="h-10 bg-slate-800 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3 mb-6"></div>
        {items.map((_, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 bg-slate-800 rounded w-32"></div>
                <div className="h-3 bg-slate-800/60 rounded w-24"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-800 rounded w-24"></div>
            <div className="h-4 bg-slate-800 rounded w-20"></div>
            <div className="h-8 bg-slate-800 rounded-xl w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'metric') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {items.map((_, idx) => (
          <div key={idx} className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 bg-slate-800 rounded w-24"></div>
              <div className="w-9 h-9 bg-slate-800 rounded-xl"></div>
            </div>
            <div className="h-8 bg-slate-800 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
