import React from 'react';
import Modal from '../common/Modal';
import { formatCurrency, formatDate } from '../../utils/dateUtils';
import { Calendar, Clock, User, Car, DollarSign, CheckCircle, XCircle, ShieldCheck, Tag } from 'lucide-react';

const BookingDetailModal = ({ isOpen, onClose, booking, onComplete, onCancel }) => {
  if (!booking) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Booking Contract: ${booking.id}`} maxWidth="max-w-xl">
      <div className="space-y-5 text-sm text-slate-300">
        {/* Header Status Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl">
          <div>
            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-widest">
              Contract Reference
            </span>
            <p className="text-lg font-black text-white font-mono">{booking.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        {/* Customer & Car Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-purple-400" /> Customer Information
            </p>
            <p className="font-bold text-white">{booking.customerName}</p>
            <p className="text-xs text-slate-400">{booking.customerEmail}</p>
          </div>

          <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-indigo-400" /> Rented Vehicle
            </p>
            <p className="font-bold text-white">{booking.carName}</p>
            <p className="text-xs text-indigo-400 font-semibold">{formatCurrency(booking.pricePerDay)} / day</p>
          </div>
        </div>

        {/* Schedule & Financial Breakdown */}
        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" /> Pickup Date:
            </span>
            <span className="font-semibold text-white">{formatDate(booking.pickupDate)}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" /> Return Date:
            </span>
            <span className="font-semibold text-white">{formatDate(booking.returnDate)}</span>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-slate-700/60 pt-2.5">
            <span className="text-slate-400">Total Rental Duration:</span>
            <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
              {booking.days} {booking.days === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-t border-slate-700/60 pt-2.5">
            <span className="font-extrabold text-white">Total Amount Paid / Due:</span>
            <span className="text-xl font-black text-emerald-400">{formatCurrency(booking.totalCost)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {booking.status === 'Active' && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                onComplete(booking.id);
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Completed
            </button>
            <button
              onClick={() => {
                onCancel(booking.id);
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Cancel Booking
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingDetailModal;
