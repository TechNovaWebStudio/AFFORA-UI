'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, TrendingUp, X, Check, Search, Filter, Tag, ShoppingBag, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';

export default function AdminOffersPage() {
  const { toast } = useToast();
  const { confirm } = usePopup();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    active: true,
  });

  const fetchOffers = async () => {
    try {
      const res = await adminApi.getOffers();
      setOffers(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createOffer(formData);
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        active: true,
      });
      fetchOffers();
      toast.success('Offer created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create offer');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Are you sure you want to delete this promotional offer?');
    if (!isConfirmed) return;
    try {
      await adminApi.deleteOffer(id);
      toast.success('Offer deleted successfully');
      fetchOffers();
    } catch (err) {
      toast.error('Failed to delete offer');
    }
  };

  // Automatic status calculation helper
  const getOfferStatus = (offer) => {
    if (offer.active === false) return 'Inactive';
    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    if (!isNaN(start.getTime()) && now < start) return 'Scheduled';
    if (!isNaN(end.getTime()) && now > end) return 'Expired';
    return 'Active';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Expired':
        return 'bg-gray-100 text-gray-700';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Filter logic
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.discountType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === 'All Types' ||
      (typeFilter === 'Percentage' && offer.discountType === 'percentage') ||
      (typeFilter === 'Fixed Amount' && offer.discountType === 'fixed');

    const status = getOfferStatus(offer);
    const matchesStatus = statusFilter === 'All Status' || status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredOffers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentOffers = filteredOffers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark flex items-center gap-2">
            Promotional Offers <TrendingUp className="text-brand-primary" size={24} />
          </h1>
          <p className="text-xs text-brand-textSub mt-1">Manage store-wide or category-specific promotional campaigns.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-brand-primaryHover transition-all shadow-sm"
        >
          <Plus size={16} /> Create Offer
        </button>
      </div>

      {/* 2. SEARCH / FILTER SECTION */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers by name or type..."
            className="w-full pl-10 pr-4 py-2.5 bg-brand-light/40 border border-brand-border/60 rounded-xl text-xs text-brand-dark outline-none focus:border-brand-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-brand-border/60 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="Percentage">Percentage</option>
            <option value="Fixed Amount">Fixed Amount</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white border border-brand-border/60 rounded-xl text-xs font-semibold text-brand-dark outline-none focus:border-brand-primary cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('All Types');
              setStatusFilter('All Status');
            }}
            className="px-4 py-2.5 bg-white border border-brand-border/60 rounded-xl text-xs font-semibold text-brand-dark flex items-center gap-2 hover:bg-brand-light/50 transition-all whitespace-nowrap"
          >
            <Filter size={14} /> Filters
          </button>
        </div>
      </div>

      {/* 3. OFFERS TABLE */}
      {loading ? (
        <div className="py-20 text-center text-brand-textSub flex flex-col items-center bg-white rounded-2xl border border-brand-border/60">
          <div className="w-10 h-10 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin mb-4"></div>
          Loading campaigns...
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light/30 border-b border-brand-border/60 text-[11px] font-bold text-brand-dark uppercase tracking-wider">
                  <th className="px-6 py-4">Offer Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Starts</th>
                  <th className="px-6 py-4">Ends</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-xs">
                {currentOffers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-16 text-center text-brand-textSub">
                      <TrendingUp className="mx-auto text-brand-border mb-3" size={36} />
                      <p className="font-bold text-brand-dark text-sm">No promotional offers found</p>
                      <p className="text-xs text-brand-textSub mt-1">Try adjusting your search or filter criteria.</p>
                    </td>
                  </tr>
                ) : (
                  currentOffers.map((offer) => {
                    const status = getOfferStatus(offer);
                    const isPercentage = offer.discountType === 'percentage';
                    return (
                      <tr key={offer._id} className="hover:bg-brand-light/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              {isPercentage ? <Tag size={16} /> : <ShoppingBag size={16} />}
                            </div>
                            <div>
                              <p className="font-bold text-brand-dark">{offer.title}</p>
                              <p className="text-[11px] text-brand-textSub line-clamp-1">{offer.description || 'No description'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-brand-dark">
                          {isPercentage ? 'Percentage' : 'Fixed Amount'}
                        </td>
                        <td className="px-6 py-4 font-extrabold text-brand-primary">
                          {isPercentage ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                        </td>
                        <td className="px-6 py-4 text-brand-textSub font-medium">
                          {formatDate(offer.startDate)}
                        </td>
                        <td className="px-6 py-4 text-brand-textSub font-medium">
                          {formatDate(offer.endDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${getStatusBadgeClass(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                toast.info('Edit campaign feature');
                              }}
                              className="p-1.5 text-brand-textSub hover:text-brand-primary hover:bg-brand-light rounded-lg transition-all"
                              title="Edit Offer"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(offer._id)}
                              className="p-1.5 text-brand-textSub hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Offer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 4. PAGINATION */}
          <div className="px-6 py-4 bg-white border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-textSub">
            <div>
              Showing {totalItems === 0 ? 0 : startIndex} to {endIndex} of {totalItems} offers
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-brand-border/60 rounded-lg font-semibold text-brand-dark outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed text-brand-dark transition-all"
                  title="First Page"
                >
                  <ChevronsLeft size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed text-brand-dark transition-all"
                  title="Previous Page"
                >
                  <ChevronLeft size={14} />
                </button>

                <button className="px-3 py-1 rounded-lg bg-brand-primary text-white font-bold">
                  {currentPage}
                </button>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed text-brand-dark transition-all"
                  title="Next Page"
                >
                  <ChevronRight size={14} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed text-brand-dark transition-all"
                  title="Last Page"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CREATE OFFER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-brand-border space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-display font-bold text-lg text-brand-dark">Create Campaign Offer</h3>
              <button onClick={() => setShowModal(false)} className="text-brand-textSub hover:text-brand-dark">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-dark mb-1">Campaign Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-brand-border rounded-xl p-2.5 focus:border-brand-primary outline-none"
                  placeholder="Diwali Super Sale"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-dark mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-brand-border rounded-xl p-2.5 focus:border-brand-primary outline-none resize-none"
                  rows="2"
                  placeholder="Get amazing discounts this festive season!"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full border border-brand-border rounded-xl p-2.5 outline-none focus:border-brand-primary bg-white cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Discount Value</label>
                  <input
                    required
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full border border-brand-border rounded-xl p-2.5 outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Start Date</label>
                  <input
                    required
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full border border-brand-border rounded-xl p-2.5 outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">End Date</label>
                  <input
                    required
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full border border-brand-border rounded-xl p-2.5 outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-brand-border rounded-xl font-bold text-brand-dark hover:bg-brand-light/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primaryHover transition-all"
                >
                  {saving ? 'Publishing...' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}