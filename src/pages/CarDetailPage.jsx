import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Users,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  ShieldCheck,
  Share2,
  Check
} from 'lucide-react';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById, updateCar, deleteCar } = useCars();
  const { customers } = useCustomers();

  const car = getCarById(id);

  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [rentalDays, setRentalDays] = useState(3);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  if (!car) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <p className="text-slate-400 text-sm">The vehicle requested does not exist or was removed.</p>
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-500 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Fleet
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateCar(car.id, { availabilityStatus: newStatus });
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleConfirmRental = (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      toast.error('Please select a customer for this rental contract.');
      return;
    }
    const customer = customers.find((c) => c.id === selectedCustomerId);
    updateCar(car.id, { availabilityStatus: 'Booked' });
    toast.success(`Successfully booked ${car.brand} ${car.model} for ${customer?.name || 'Customer'}!`);
    setIsRentModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteCar(car.id);
    toast.info(`${car.brand} ${car.model} deleted.`);
    navigate('/cars');
  };

  const totalCost = car.pricePerDay * rentalDays;

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/cars')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Fleet
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.info('Vehicle URL copied to clipboard!');
            }}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition text-xs font-medium flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" /> Share Specs
          </button>
        </div>
      </div>

      {/* Main Car Detail Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Car Image Preview */}
        <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[350px] bg-slate-800">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700 text-white font-bold text-sm shadow">
            {car.brand}
          </div>
        </div>

        {/* Specifications & Controls */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                {car.year} Model
              </span>
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  car.availabilityStatus === 'Available'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : car.availabilityStatus === 'Booked'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {car.availabilityStatus}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {car.brand} {car.model}
            </h1>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">${car.pricePerDay}</span>
              <span className="text-xs text-slate-400 font-medium">USD / day</span>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {car.description ||
                'High-performance engineering coupled with refined luxury ergonomics. Fully inspected and detailed.'}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Fuel</p>
                <p className="font-bold">{car.fuelType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Transmission</p>
                <p className="font-bold">{car.transmission}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Capacity</p>
                <p className="font-bold">{car.seatingCapacity} Passengers</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Manufacture</p>
                <p className="font-bold">{car.year}</p>
              </div>
            </div>
          </div>

          {/* Status Switcher & Primary Action */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Change Availability Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Available', 'Booked', 'Maintenance'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    car.availabilityStatus === st
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {car.availabilityStatus === 'Available' ? (
              <button
                onClick={() => setIsRentModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition text-sm"
              >
                <Key className="w-4 h-4" /> Book / Rent This Vehicle
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange('Available')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition text-sm"
              >
                <Check className="w-4 h-4" /> Mark as Available
              </button>
            )}

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="w-full text-center py-2 text-rose-400 hover:text-rose-300 text-xs font-medium transition"
            >
              Remove Vehicle from System
            </button>
          </div>
        </div>
      </div>

      {/* Booking Contract Modal */}
      <Modal
        isOpen={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        title={`Rent ${car.brand} ${car.model}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmRental} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Registered Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Choose Customer --</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.name} ({cust.mobile})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Rental Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={rentalDays}
              onChange={(e) => setRentalDays(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-xl space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Daily Rate:</span>
              <span className="font-medium text-slate-200">${car.pricePerDay}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Days:</span>
              <span className="font-medium text-slate-200">{rentalDays}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white border-t border-slate-700 pt-2 mt-2">
              <span>Total Estimated:</span>
              <span className="text-indigo-400">${totalCost}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsRentModalOpen(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Car"
        message={`Are you sure you want to permanently remove ${car.brand} ${car.model}?`}
      />
    </div>
  );
};

export default CarDetailPage;
