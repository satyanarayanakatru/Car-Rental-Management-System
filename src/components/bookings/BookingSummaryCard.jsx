import React from 'react';
import { calculateRentalDays, formatCurrency } from '../../utils/dateUtils';
import { Calendar, Car, User, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const BookingSummaryCard = ({ car, customer, pickupDate, returnDate, conflictReason }) => {
  const days = calculateRentalDays(pickupDate, returnDate);
  const totalCost = car ? days * car.pricePerDay : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 sticky top-24">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" /> Booking Summary
        </h3>
        <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold text-xs rounded-full">
          Live Estimate
        </span>
      </div>

      {conflictReason && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 text-rose-400 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Booking Conflict Detected</p>
            <p className="mt-0.5 text-slate-300">{conflictReason}</p>
          </div>
        </div>
      )}

      {/* Customer Info */}
      <div className="p-3.5 bg-slate-800/60 border border-slate-700/50 rounded-2xl space-y-1">
        <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <User className="w-3 h-3 text-purple-400" /> Selected Customer
        </p>
        {customer ? (
          <div>
            <p className="font-bold text-white text-sm">{customer.name}</p>
            <p className="text-xs text-slate-400">{customer.email} • {customer.mobile}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">Please select a customer</p>
        )}
      </div>

      {/* Car Info */}
      <div className="p-3.5 bg-slate-800/60 border border-slate-700/50 rounded-2xl space-y-2">
        <p className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
          <Car className="w-3 h-3 text-indigo-400" /> Selected Vehicle
        </p>
        {car ? (
          <div className="flex items-center gap-3">
            <img
              src={car.image}
              alt={car.model}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div>
              <p className="font-bold text-white text-sm">{car.brand} {car.model}</p>
              <p className="text-xs text-indigo-400 font-semibold">{formatCurrency(car.pricePerDay)} / day</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">Please select a vehicle</p>
        )}
      </div>

      {/* Date & Cost Breakdown */}
      <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl space-y-3">
        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /> Pickup Date
          </span>
          <span className="font-semibold text-white">{pickupDate || 'Not selected'}</span>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-300">
          <span className="flex items-center gap-1 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /> Return Date
          </span>
          <span className="font-semibold text-white">{returnDate || 'Not selected'}</span>
        </div>

        <div className="border-t border-slate-700/60 pt-3 flex justify-between items-center text-xs text-slate-300">
          <span className="text-slate-400">Rental Duration</span>
          <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            {days} {days === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        <div className="border-t border-slate-700/60 pt-3 flex justify-between items-center">
          <span className="text-sm font-extrabold text-white">Total Amount</span>
          <span className="text-2xl font-black text-emerald-400">{formatCurrency(totalCost)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
