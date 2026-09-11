import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import BookingDetailModal from '../components/bookings/BookingDetailModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import { formatCurrency, formatDate } from '../utils/dateUtils';
import { toast } from 'react-toastify';
import {
  Clock,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
  Layers,
  FileText,
  User,
  Car
} from 'lucide-react';

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking, completeBooking } = useBookings();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // Filtered Bookings Memo
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        b.id.toLowerCase().includes(term) ||
        b.customerName.toLowerCase().includes(term) ||
        b.customerEmail.toLowerCase().includes(term) ||
        b.carName.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesDate = !dateFilter || b.pickupDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;

  const paginatedBookings = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const handleOpenDetail = (b) => {
    setSelectedBooking(b);
    setIsDetailOpen(true);
  };

  const handleOpenCancel = (b) => {
    setBookingToCancel(b);
    setIsConfirmCancelOpen(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel.id);
      toast.info(`Booking ${bookingToCancel.id} cancelled. Vehicle returned to fleet.`);
      setBookingToCancel(null);
      setIsConfirmCancelOpen(false);
    }
  };

  const handleComplete = (bookingId) => {
    completeBooking(bookingId);
    toast.success(`Booking ${bookingId} marked as completed!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="w-7 h-7 text-indigo-400" /> Booking History & Contracts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, view contract details, complete, or cancel customer rental bookings.
          </p>
        </div>

        <button
          onClick={() => navigate('/rent')}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/30 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Rental Booking</span>
        </button>
      </div>

      {/* Toolbar Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by customer, car, email, or booking ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-2xl text-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-500"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="ml-2 text-xs text-rose-400 hover:text-rose-300 font-semibold"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Status:</span>
          {['All', 'Active', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
        {paginatedBookings.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="font-semibold text-slate-300">No Booking History Found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search keyword or status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs font-semibold text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Booking ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Rented Vehicle</th>
                  <th className="px-4 py-3">Dates & Duration</th>
                  <th className="px-4 py-3">Total Cost</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-4 font-mono font-bold text-xs text-indigo-400">{b.id}</td>

                    <td className="px-4 py-4">
                      <div>
                        <p className="font-bold text-white text-xs sm:text-sm">{b.customerName}</p>
                        <p className="text-[11px] text-slate-400">{b.customerEmail}</p>
                      </div>
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-200">{b.carName}</td>

                    <td className="px-4 py-4 space-y-0.5">
                      <p className="text-xs text-slate-300">
                        {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}
                      </p>
                      <p className="text-[11px] text-slate-500 font-semibold">{b.days} Days</p>
                    </td>

                    <td className="px-4 py-4 font-bold text-white">{formatCurrency(b.totalCost)}</td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          b.status === 'Active'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : b.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(b)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {b.status === 'Active' && (
                          <>
                            <button
                              onClick={() => handleComplete(b.id)}
                              className="p-2 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl transition"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenCancel(b)}
                              className="p-2 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl transition"
                              title="Cancel Booking"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={filteredBookings.length}
          itemsPerPage={5}
        />
      </div>

      {/* Detail Modal */}
      <BookingDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        booking={selectedBooking}
        onComplete={handleComplete}
        onCancel={handleOpenCancel}
      />

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking Contract"
        message={`Are you sure you want to cancel booking ${bookingToCancel?.id}? The vehicle will automatically be set back to Available status.`}
        confirmText="Cancel Booking"
      />
    </div>
  );
};

export default BookingHistoryPage;
