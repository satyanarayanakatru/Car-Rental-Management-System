import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import { useCustomers } from '../context/CustomerContext';
import {
  Car,
  CheckCircle2,
  Clock,
  Users,
  Key,
  DollarSign,
  TrendingUp,
  Plus,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { cars } = useCars();
  const { customers } = useCustomers();

  // Metrics Calculation
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.availabilityStatus === 'Available').length;
  const bookedCars = cars.filter((c) => c.availabilityStatus === 'Booked').length;
  const maintenanceCars = cars.filter((c) => c.availabilityStatus === 'Maintenance').length;

  const totalCustomersCount = customers.length;
  const activeRentalsCount = bookedCars;

  // Revenue calculation based on booked cars price per day + dummy historical base
  const dailyRevenue = cars
    .filter((c) => c.availabilityStatus === 'Booked')
    .reduce((acc, curr) => acc + curr.pricePerDay, 0);
  const totalRevenue = 45280 + dailyRevenue * 30; // $45.2k base + active rental projection

  const recentBookings = [
    {
      id: 'BK-9921',
      customer: 'Rahul Sharma',
      car: 'BMW M4 Competition',
      duration: '3 Days',
      amount: '$450',
      status: 'Active',
      date: 'Today, 10:30 AM'
    },
    {
      id: 'BK-9920',
      customer: 'Priya Patel',
      car: 'Tesla Model S Plaid',
      duration: '5 Days',
      amount: '$900',
      status: 'Active',
      date: 'Yesterday'
    },
    {
      id: 'BK-9919',
      customer: 'Alexander Wright',
      car: 'Ford Mustang GT',
      duration: '2 Days',
      amount: '$220',
      status: 'Completed',
      date: '08 Sep 2026'
    },
    {
      id: 'BK-9918',
      customer: 'Sneha Reddy',
      car: 'Porsche 911 Carrera S',
      duration: '1 Day',
      amount: '$220',
      status: 'Active',
      date: '07 Sep 2026'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 border border-indigo-700/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-80 h-80 bg-indigo-500/20 blur-[90px] rounded-full"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-200 text-xs font-medium mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Executive Dashboard
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fleet Overview & Operations
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Monitor real-time rental availability, track revenue performance, and manage customers effortlessly.
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Cars */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cars</span>
            <div className="p-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{totalCars}</span>
            <span className="text-xs text-slate-400">Fleet Units</span>
          </div>
        </div>

        {/* Available Cars */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available</span>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400">{availableCars}</span>
            <span className="text-xs text-emerald-500/80 font-medium">Ready to Rent</span>
          </div>
        </div>

        {/* Booked Cars */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Booked</span>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-400">{bookedCars}</span>
            <span className="text-xs text-amber-500/80 font-medium">On Road</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customers</span>
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{totalCustomersCount}</span>
            <span className="text-xs text-slate-400">Registered</span>
          </div>
        </div>

        {/* Active Rentals */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Rentals</span>
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Key className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-blue-400">{activeRentalsCount}</span>
            <span className="text-xs text-blue-400/80 font-medium">Contracts</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-800/40 rounded-2xl shadow-lg hover:border-indigo-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Est. Revenue</span>
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-indigo-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white">${totalRevenue.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 flex items-center font-bold">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/cars?action=add')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 rounded-2xl text-left transition group shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white group-hover:text-indigo-400 transition">Add New Car</h4>
            <p className="text-xs text-slate-400 mt-1">Insert a new vehicle specs & pricing into fleet</p>
          </button>

          <button
            onClick={() => navigate('/customers?action=add')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/60 rounded-2xl text-left transition group shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white group-hover:text-purple-400 transition">Add Customer</h4>
            <p className="text-xs text-slate-400 mt-1">Register new client details and license verification</p>
          </button>

          <button
            onClick={() => navigate('/cars')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/60 rounded-2xl text-left transition group shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition">
              <Car className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white group-hover:text-emerald-400 transition">Browse Fleet</h4>
            <p className="text-xs text-slate-400 mt-1">Filter, sort, and edit existing car inventory</p>
          </button>

          <button
            onClick={() => navigate('/customers')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/60 rounded-2xl text-left transition group shadow-md"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white group-hover:text-blue-400 transition">View Customers</h4>
            <p className="text-xs text-slate-400 mt-1">Manage active user accounts & rental history</p>
          </button>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Rentals & Contracts</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live activity feed of customer vehicle rentals</p>
          </div>
          <button
            onClick={() => navigate('/cars')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            View All Fleet <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs font-semibold text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Booking ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Car Rented</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-xl text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3.5 font-mono text-xs font-semibold text-indigo-400">{b.id}</td>
                  <td className="px-4 py-3.5 font-medium text-white">{b.customer}</td>
                  <td className="px-4 py-3.5 text-slate-200">{b.car}</td>
                  <td className="px-4 py-3.5 text-slate-400">{b.duration}</td>
                  <td className="px-4 py-3.5 font-bold text-white">{b.amount}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        b.status === 'Active'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-slate-400">{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
