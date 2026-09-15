import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCustomers } from '../context/CustomerContext';
import CustomerFormModal from '../components/customers/CustomerFormModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import { toast } from 'react-toastify';
import { Users, UserPlus, Search, Edit3, Trash2, Mail, Phone, CreditCard, MapPin } from 'lucide-react';

const CustomersPage = () => {
  const {
    paginatedCustomers,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomers();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setIsFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
      toast.success(`Customer ${data.name} updated successfully!`);
    } else {
      addCustomer(data);
      toast.success(`Customer ${data.name} registered successfully!`);
    }
  };

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete.id);
      toast.info(`Customer ${customerToDelete.name} removed from record.`);
      setCustomerToDelete(null);
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-400" /> Customer Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain registered driver profiles, verify licenses, and monitor active customer rentals.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-600/30 transition text-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer by name, email, mobile, or driving license..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/70 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm transition"
          />
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
        {paginatedCustomers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Customers Found"
            description="Try refining your search query or click below to register a new customer profile."
            actionLabel="Register Customer"
            onAction={handleOpenAdd}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs font-semibold text-slate-400 uppercase bg-slate-800/50 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Customer Name</th>
                  <th className="px-4 py-3">Contact Details</th>
                  <th className="px-4 py-3">License Number</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 space-y-1">
                      <p className="text-xs text-slate-200 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" /> {c.email}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" /> +91 {c.mobile}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs font-semibold text-purple-300">
                        <CreditCard className="w-3.5 h-3.5 text-purple-400" /> {c.licenseNumber}
                      </span>
                    </td>

                    <td className="px-4 py-4 max-w-xs truncate text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {c.address}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(c)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl transition"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p)}
          totalItems={totalCustomers}
          itemsPerPage={5}
        />
      </div>

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialCustomer={editingCustomer}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to remove customer profile for ${customerToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default CustomersPage;
