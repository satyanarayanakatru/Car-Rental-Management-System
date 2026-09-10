import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuel, Gauge, Users, Calendar, Edit3, Trash2, Eye, DollarSign } from 'lucide-react';

const CarCard = ({ car, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Booked':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Maintenance':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 flex flex-col group">
      {/* Image Banner & Status Badge */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-800">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-white font-semibold text-xs rounded-full shadow-lg">
            {car.brand}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 backdrop-blur-md border text-xs font-bold rounded-full shadow-lg ${getStatusBadge(
              car.availabilityStatus
            )}`}
          >
            {car.availabilityStatus}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-sm shadow">
          ${car.pricePerDay} <span className="font-normal text-[10px] text-indigo-200">/ day</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition truncate">
              {car.brand} {car.model}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {car.description || `${car.year} model premium car engineered for comfort and performance.`}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-indigo-400" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-purple-400" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{car.seatingCapacity} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{car.year} Model</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => navigate(`/cars/${car.id}`)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 font-semibold rounded-xl text-xs transition duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onEdit(car)}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 rounded-xl transition"
            title="Edit Vehicle"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(car)}
            className="p-2.5 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl transition"
            title="Delete Vehicle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
