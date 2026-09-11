import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import { useBookings } from '../context/BookingContext';
import BookingSummaryCard from '../components/bookings/BookingSummaryCard';
import { getTodayString, getTomorrowString, calculateRentalDays } from '../utils/dateUtils';
import { toast } from 'react-toastify';
import { Key, Car, User, Calendar, CheckCircle, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCarId = searchParams.get('carId');

  const { cars } = useCars();
  const { customers } = useCustomers();
  const { createBooking, isCarAvailableForDates } = useBookings();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCarId, setSelectedCarId] = useState(preselectedCarId || '');
  const [pickupDate, setPickupDate] = useState(getTodayString());
  const [returnDate, setReturnDate] = useState(getTomorrowString());
  const [conflictReason, setConflictReason] = useState('');

  // Find target objects
  const selectedCar = cars.find((c) => c.id === selectedCarId);
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Check Availability Conflicts whenever Car or Dates change
  useEffect(() => {
    if (selectedCarId && pickupDate && returnDate) {
      const check = isCarAvailableForDates(selectedCarId, pickupDate, returnDate);
      if (!check.available) {
        setConflictReason(check.reason);
      } else {
        setConflictReason('');
      }
    } else {
      setConflictReason('');
    }
  }, [selectedCarId, pickupDate, returnDate, isCarAvailableForDates]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!selectedCustomerId) {
      toast.error('Please select a registered customer.');
      return;
    }
    if (!selectedCarId) {
      toast.error('Please select a vehicle to rent.');
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error('Please specify both Pickup and Return dates.');
      return;
    }

    const days = calculateRentalDays(pickupDate, returnDate);
    if (days <= 0) {
      toast.error('Return date must be after or equal to Pickup date.');
      return;
    }

    if (conflictReason) {
      toast.error(conflictReason);
      return;
    }

    const result = createBooking({
      carId: selectedCarId,
      customerId: selectedCustomerId,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      pickupDate,
      returnDate
    });

    if (result.success) {
      toast.success(`Booking Confirmed! ${selectedCar.brand} ${selectedCar.model} reserved for ${selectedCustomer.name}.`);
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Key className="w-7 h-7 text-indigo-400" /> New Rental Contract
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reserve a vehicle for a customer with automated duration and total cost calculation.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-xs font-medium">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Conflict Protection Active
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Booking Controls Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <form onSubmit={handleBookingSubmit} className="space-y-5">
            {/* Step 1: Select Customer */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-purple-400" /> 1. Select Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition"
              >
                <option value="">-- Select Registered Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email}) - License: {c.licenseNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Select Car */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-indigo-400" /> 2. Select Vehicle *
              </label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm transition"
              >
                <option value="">-- Choose Car from Fleet --</option>
                {cars.map((car) => (
                  <option
                    key={car.id}
                    value={car.id}
                    disabled={car.availabilityStatus === 'Maintenance'}
                  >
                    {car.brand} {car.model} ({car.fuelType}, {car.transmission}) - ${car.pricePerDay}/day{' '}
                    {car.availabilityStatus === 'Maintenance' ? '[In Maintenance]' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Date Range Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" /> Pickup Date *
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  min={getTodayString()}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" /> Return Date *
                </label>
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate || getTodayString()}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700/80 rounded-2xl text-slate-100 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Confirm Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={!!conflictReason || !selectedCarId || !selectedCustomerId}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Confirm & Create Booking</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Booking Summary Card Sidebar */}
        <div className="lg:col-span-5">
          <BookingSummaryCard
            car={selectedCar}
            customer={selectedCustomer}
            pickupDate={pickupDate}
            returnDate={returnDate}
            conflictReason={conflictReason}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
