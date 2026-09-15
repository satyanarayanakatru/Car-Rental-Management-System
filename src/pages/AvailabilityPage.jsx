import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { useBookings } from '../context/BookingContext';
import StatusBadge from '../components/availability/StatusBadge';
import { formatCurrency } from '../utils/dateUtils';
import { toast } from 'react-toastify';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Wrench,
  Car as CarIcon,
  Search,
  Key,
  Eye,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';

const AvailabilityPage = () => {
  const navigate = useNavigate();
  const { cars, updateCar } = useCars();
  const { bookings } = useBookings();

  const [selectedTab, setSelectedTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Counts
  const totalFleet = cars.length;
  const availableCount = cars.filter((c) => c.availabilityStatus === 'Available').length;
  const rentedCount = cars.filter((c) => c.availabilityStatus === 'Booked' || c.availabilityStatus === 'Rented').length;
  const maintenanceCount = cars.filter((c) => c.availabilityStatus === 'Maintenance').length;

  // Active bookings map to find which customer rented which car
  const activeBookingMap = useMemo(() => {
    const map = {};
    const bookingList = Array.isArray(bookings) ? bookings : [];
    bookingList.forEach((b) => {
      if (b.status === 'Active') {
        map[b.carId] = b;
      }
    });
    return map;
  }, [bookings]);

  // Filtered cars for current tab & search keyword
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        car.brand.toLowerCase().includes(term) || car.model.toLowerCase().includes(term);

      let matchesTab = true;
      if (selectedTab === 'Available') matchesTab = car.availabilityStatus === 'Available';
      if (selectedTab === 'Rented')
        matchesTab = car.availabilityStatus === 'Booked' || car.availabilityStatus === 'Rented';
      if (selectedTab === 'Maintenance') matchesTab = car.availabilityStatus === 'Maintenance';

      return matchesSearch && matchesTab;
    });
  }, [cars, selectedTab, searchTerm]);

  const handleStatusChange = (car, newStatus) => {
    updateCar(car.id, { availabilityStatus: newStatus });
    toast.success(`Updated ${car.brand} ${car.model} status to ${newStatus}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" /> Fleet Availability Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status control for Available, Rented, and Maintenance vehicles across Context API.
          </p>
        </div>

        <button
          onClick={() => navigate('/rent')}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-600/30 transition text-sm"
        >
          <Key className="w-4 h-4" />
          <span>Rent a Car</span>
        </button>
      </div>

      {/* Real-time Status Metric Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Fleet */}
        <div
          onClick={() => setSelectedTab('All')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            selectedTab === 'All'
              ? 'bg-slate-800 border-indigo-500 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fleet</span>
            <CarIcon className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{totalFleet}</p>
        </div>

        {/* Available */}
        <div
          onClick={() => setSelectedTab('Available')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            selectedTab === 'Available'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Available Cars</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-2">{availableCount}</p>
        </div>

        {/* Rented */}
        <div
          onClick={() => setSelectedTab('Rented')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            selectedTab === 'Rented'
              ? 'bg-amber-950/40 border-amber-500 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rented Cars</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 mt-2">{rentedCount}</p>
        </div>

        {/* Maintenance */}
        <div
          onClick={() => setSelectedTab('Maintenance')}
          className={`p-4 rounded-2xl border cursor-pointer transition ${
            selectedTab === 'Maintenance'
              ? 'bg-rose-950/40 border-rose-500 shadow-lg'
              : 'bg-slate-900 border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Maintenance</span>
            <Wrench className="w-5 h-5 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-rose-400 mt-2">{maintenanceCount}</p>
        </div>
      </div>

      {/* Search & Tabs Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search car by brand or model..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition"
            />
          </div>

          {/* Availability Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['All', 'Available', 'Rented', 'Maintenance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition whitespace-nowrap ${
                  selectedTab === tab
                    ? tab === 'Available'
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : tab === 'Rented'
                      ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                      : tab === 'Maintenance'
                      ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                      : 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'All' ? 'All Fleet' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Vehicles Grid */}
      {filteredCars.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-3">
          <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Vehicles in This Category</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            There are currently no vehicles matching your search keyword or selected availability filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => {
            const activeBooking = activeBookingMap[car.id];
            return (
              <div
                key={car.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition duration-300"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white font-bold text-xs rounded-full shadow">
                        {car.brand}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <StatusBadge status={car.availabilityStatus} />
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm border border-slate-700">
                      {formatCurrency(car.pricePerDay)} <span className="font-normal text-[10px] text-slate-400">/ day</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                      {car.brand} {car.model}
                    </h3>

                    {/* Active Rented Info if Rented */}
                    {activeBooking ? (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-xs">
                        <p className="font-bold text-amber-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Currently Rented
                        </p>
                        <p className="text-slate-200 font-medium">{activeBooking.customerName}</p>
                        <p className="text-[11px] text-slate-400">
                          {activeBooking.pickupDate} → {activeBooking.returnDate}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {car.description || `${car.year} model premium car in fleet.`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="p-5 pt-0 space-y-3 border-t border-slate-800/80 mt-2">
                  <div className="pt-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Update Availability Status
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Available', 'Booked', 'Maintenance'].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(car, st)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                            car.availabilityStatus === st
                              ? st === 'Available'
                                ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                                : st === 'Booked'
                                ? 'bg-amber-600 border-amber-500 text-white shadow'
                                : 'bg-rose-600 border-rose-500 text-white shadow'
                              : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
                          }`}
                        >
                          {st === 'Booked' ? 'Rented' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => navigate(`/cars/${car.id}`)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/60 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> Specs Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AvailabilityPage;
