import React, { useState } from 'react';
import { formatCurrency } from '../../utils/dateUtils';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

const RevenueChart = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const defaultData = [
    { month: 'Jan', revenue: 24500, bookings: 42 },
    { month: 'Feb', revenue: 28200, bookings: 48 },
    { month: 'Mar', revenue: 31000, bookings: 54 },
    { month: 'Apr', revenue: 36800, bookings: 62 },
    { month: 'May', revenue: 42500, bookings: 71 },
    { month: 'Jun', revenue: 49000, bookings: 83 },
    { month: 'Jul', revenue: 56200, bookings: 95 },
    { month: 'Aug', revenue: 53100, bookings: 90 },
    { month: 'Sep', revenue: 58900, bookings: 98 },
    { month: 'Oct', revenue: 62400, bookings: 104 },
    { month: 'Nov', revenue: 68100, bookings: 112 },
    { month: 'Dec', revenue: 74500, bookings: 125 }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue)) * 1.15;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> Revenue Growth Performance
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Month-by-month rental income breakdown & growth trends</p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" /> +24.8% YoY Growth
        </div>
      </div>

      {/* SVG Bar & Trend Visualization */}
      <div className="relative pt-8 pb-4">
        {/* Hover Tooltip display */}
        {hoveredIndex !== null && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-xs shadow-xl flex items-center gap-3 animate-fadeIn z-10">
            <div>
              <p className="text-slate-400 font-semibold">{chartData[hoveredIndex].month} Revenue</p>
              <p className="font-extrabold text-emerald-400 text-sm">{formatCurrency(chartData[hoveredIndex].revenue)}</p>
            </div>
            <div className="pl-3 border-l border-slate-700">
              <p className="text-slate-400 font-semibold">Bookings</p>
              <p className="font-extrabold text-white text-sm">{chartData[hoveredIndex].bookings} Contracts</p>
            </div>
          </div>
        )}

        {/* Chart Canvas Grid */}
        <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6">
          {chartData.map((d, idx) => {
            const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={d.month}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end"
              >
                <div className="w-full bg-slate-800/60 rounded-t-xl overflow-hidden flex items-end relative h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      isHovered
                        ? 'bg-gradient-to-t from-indigo-600 via-purple-600 to-emerald-400 shadow-lg shadow-indigo-500/30'
                        : 'bg-gradient-to-t from-indigo-900/80 via-indigo-600/70 to-indigo-500/80 group-hover:from-indigo-600 group-hover:to-purple-500'
                    }`}
                  />
                </div>
                <span
                  className={`mt-2 text-[11px] font-bold transition ${
                    isHovered ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                >
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
