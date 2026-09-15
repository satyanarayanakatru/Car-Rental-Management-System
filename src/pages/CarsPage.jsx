import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCars } from '../context/CarContext';
import CarCard from '../components/cars/CarCard';
import CarFilterBar from '../components/cars/CarFilterBar';
import CarFormModal from '../components/cars/CarFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { toast } from 'react-toastify';
import { Plus, Car as CarIcon, AlertCircle, RefreshCw, Search } from 'lucide-react';

const CarsPage = () => {
  const { filteredCars, loading, error, addCar, updateCar, deleteCar, refetchCars } = useCars();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleOpenAddModal = () => {
    setEditingCar(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (car) => {
    setEditingCar(car);
    setIsFormOpen(true);
  };

  const handleOpenDeleteDialog = (car) => {
    setCarToDelete(car);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (carData) => {
    if (editingCar) {
      updateCar(editingCar.id, carData);
      toast.success(`${carData.brand} ${carData.model} updated successfully!`);
    } else {
      addCar(carData);
      toast.success(`New vehicle ${carData.brand} ${carData.model} added to fleet!`);
    }
  };

  const handleConfirmDelete = () => {
    if (carToDelete) {
      deleteCar(carToDelete.id);
      toast.info(`${carToDelete.brand} ${carToDelete.model} deleted from inventory.`);
      setCarToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CarIcon className="w-7 h-7 text-indigo-400" /> Car Fleet Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, edit, or add vehicles to your active car rental fleet.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-600/30 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Car</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <CarFilterBar />

      {/* Loading Skeleton */}
      {loading && <SkeletonLoader type="card" count={8} />}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Failed to Load Fleet</h3>
          <p className="text-slate-300 text-xs">{error}</p>
          <button
            onClick={refetchCars}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-500 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
          </button>
        </div>
      )}

      {/* Cars Grid */}
      {!loading && !error && (
        <>
          {filteredCars.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No Vehicles Match Your Search"
              description="Try adjusting your brand, fuel type, transmission filters, or search keyword to discover cars in fleet."
              actionLabel="Add New Car"
              onAction={handleOpenAddModal}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteDialog}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Car Form Modal */}
      <CarFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialCar={editingCar}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to remove ${carToDelete?.brand} ${carToDelete?.model} from the fleet? This action cannot be undone.`}
        confirmText="Delete Vehicle"
      />
    </div>
  );
};

export default CarsPage;
