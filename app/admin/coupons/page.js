'use client';

import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Tag, 
  Search, 
  SlidersHorizontal, 
  ChevronsLeft, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsRight 
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';

export default function AdminCouponsPage() {
  const { toast } = useToast();
  const { confirm } = usePopup();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minimumAmount: 499,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
    active: true,
  });

  const fetchCoupons = async () => {
    try {
      const res = await adminApi.getCoupons();
      setCoupons(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Reset pagination when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, statusFilter, itemsPerPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createCoupon(formData);
      setShowModal(false);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minimumAmount: 499,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 100,
        active: true,
      });
      fetchCoupons();
      toast.success('Coupon created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Are you sure you want to delete this coupon?');
    if (!isConfirmed) return;
    try {
      await adminApi.deleteCoupon(id);
      toast.success('Coupon deleted successfully');
      fetchCoupons();
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  // Filtering Logic
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = 
      coupon.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.discountType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesType = true;
    if (typeFilter === 'Percentage') {
      matchesType = coupon.discountType === 'percentage';
    } else if (typeFilter === 'Fixed Amount') {
      matchesType = coupon.discountType === 'fixed';
    }

    let matchesStatus = true;
    if (statusFilter === 'Active') {
      matchesStatus = coupon.active === true;
    } else if (statusFilter === 'Inactive') {
      matchesStatus = coupon.active === false;
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCoupons.length);
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full px-0 space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary border border-brand-border/60 shadow-sm">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-dark">Coupons & Promo Codes</h1>
            <p className="text-xs sm:text-sm text-brand-textSub mt-0.5">Manage promotional discount offers for customer checkouts.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-5 py-3 bg-brand-primary text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 hover:bg-brand-primaryHover transition-all shadow-sm h-[44px] sm:h-[46px]"
        >
          <Plus size={18} /> Create Coupon
        </button>
      </div>

      {/* Search + Filter Toolbar Card */}
      <div className="bg-white rounded-2xl border border-brand-border/60 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 w-full">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by code or type..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-brand-border/80 rounded-xl text-xs sm:text-sm text-brand-dark placeholder:text-brand-textSub focus:outline-none focus:border-brand-primary transition-all h-[46px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-brand-border/80 rounded-xl text-xs sm:text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-primary transition-all h-[46px]"
          >
            <option value="All Types">All Types</option>
            <option value="Percentage">Percentage</option>
            <option value="Fixed Amount">Fixed Amount</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-brand-border/80 rounded-xl text-xs sm:text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-primary transition-all h-[46px]"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button 
            type="button"
            className="px-4 py-2.5 bg-white border border-brand-border/80 rounded-xl text-xs sm:text-sm font-medium text-brand-dark flex items-center gap-2 hover:bg-brand-light/30 transition-all h-[46px]"
          >
            <SlidersHorizontal size={16} className="text-brand-textSub" /> Filters
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-brand-border/60 shadow-sm overflow-hidden w-full">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto text-left text-xs sm:text-sm">
            <thead className="bg-brand-light/40 border-b border-brand-border/60 text-brand-dark uppercase font-extrabold tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-6 w-[20%]">Code</th>
                <th className="py-4 px-6 w-[12%]">Type</th>
                <th className="py-4 px-6 w-[12%]">Discount</th>
                <th className="py-4 px-6 w-[12%]">Min. Order</th>
                <th className="py-4 px-6 w-[12%]">Expires</th>
                <th className="py-4 px-6 w-[12%]">Used / Limit</th>
                <th className="py-4 px-6 w-[10%]" >Status</th>
                <th className="py-4 px-6 text-right w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-24 text-center text-brand-textSub">Loading coupons...</td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-24 text-center text-brand-textSub">
                    {coupons.length === 0 ? 'No coupons created yet.' : 'No coupons found.'}
                  </td>
                </tr>
              ) : (
                paginatedCoupons.map((coupon) => {
                  let formattedExpiry = 'N/A';
                  try {
                    if (coupon.expiryDate) {
                      formattedExpiry = new Intl.DateTimeFormat('en-GB').format(new Date(coupon.expiryDate));
                    }
                  } catch (e) {
                    formattedExpiry = coupon.expiryDate;
                  }

                  return (
                    <tr key={coupon._id} className="hover:bg-brand-light/20 transition-colors h-[80px]">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                            <Tag size={16} />
                          </div>
                          <div>
                            <div className="font-bold text-brand-dark text-sm">{coupon.code}</div>
                            {coupon.description && (
                              <div className="text-xs text-brand-textSub font-normal">{coupon.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 capitalize text-brand-dark">
                        {coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                      </td>
                      <td className="py-4 px-6 font-bold text-brand-primary text-sm">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </td>
                      <td className="py-4 px-6 text-brand-dark">₹{coupon.minimumAmount}</td>
                      <td className="py-4 px-6 text-brand-dark">{formattedExpiry}</td>
                      <td className="py-4 px-6 text-brand-dark">{coupon.usedCount || 0} / {coupon.usageLimit}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${coupon.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                          {coupon.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            type="button" 
                            title="Edit coupon"
                            onClick={() => {
                              // TODO: connect update coupon API
                              toast.error('Edit functionality not implemented yet');
                            }}
                            className="w-9 h-9 rounded-lg border border-brand-border/80 bg-white text-brand-primary flex items-center justify-center hover:bg-brand-light/50 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            type="button" 
                            title="Delete coupon"
                            onClick={() => handleDelete(coupon._id)} 
                            className="w-9 h-9 rounded-lg border border-red-100 bg-white text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors"
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

        {/* Table Footer / Pagination */}
        <div className="px-6 py-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white w-full">
          <div className="text-xs sm:text-sm text-brand-textSub">
            Showing {filteredCoupons.length === 0 ? 0 : startIndex + 1} to {endIndex} of {filteredCoupons.length} coupons
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-textSub">
              <span>Items per page:</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-brand-border/80 rounded-lg text-brand-dark font-medium focus:outline-none focus:border-brand-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border border-brand-border/80 flex items-center justify-center text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light/30 transition-colors"
              >
                <ChevronsLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border border-brand-border/80 flex items-center justify-center text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light/30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="px-3.5 h-9 rounded-lg bg-brand-primary text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-sm">
                {currentPage}
              </div>

              <button 
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-9 h-9 rounded-lg border border-brand-border/80 flex items-center justify-center text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light/30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-9 h-9 rounded-lg border border-brand-border/80 flex items-center justify-center text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light/30 transition-colors"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 sm:p-7 max-w-md w-full shadow-2xl border border-brand-border space-y-5">
            <div className="flex justify-between items-center border-b border-brand-border/60 pb-4">
              <h3 className="font-display font-bold text-lg text-brand-dark">Create New Coupon</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-brand-textSub hover:bg-brand-light/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-brand-dark mb-1.5">Coupon Code</label>
                <input 
                  required 
                  type="text" 
                  value={formData.code} 
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                  className="w-full border border-brand-border/80 rounded-xl p-3 font-bold uppercase focus:border-brand-primary focus:outline-none" 
                  placeholder="SUMMER20" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1.5">Discount Type</label>
                  <select 
                    value={formData.discountType} 
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} 
                    className="w-full border border-brand-border/80 rounded-xl p-3 bg-white focus:border-brand-primary focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1.5">Discount Value</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.discountValue} 
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} 
                    className="w-full border border-brand-border/80 rounded-xl p-3 focus:border-brand-primary focus:outline-none" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1.5">Min Order Amount (₹)</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.minimumAmount} 
                    onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })} 
                    className="w-full border border-brand-border/80 rounded-xl p-3 focus:border-brand-primary focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1.5">Usage Limit</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.usageLimit} 
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })} 
                    className="w-full border border-brand-border/80 rounded-xl p-3 focus:border-brand-primary focus:outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-brand-dark mb-1.5">Expiry Date</label>
                <input 
                  required 
                  type="date" 
                  value={formData.expiryDate} 
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} 
                  className="w-full border border-brand-border/80 rounded-xl p-3 focus:border-brand-primary focus:outline-none" 
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-brand-border/60">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2.5 border border-brand-border/80 rounded-xl font-medium text-brand-dark hover:bg-brand-light/30 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-5 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primaryHover transition-all shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}