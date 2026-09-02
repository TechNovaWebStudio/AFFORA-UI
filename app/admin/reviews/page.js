'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../../services/adminApi';
import { 
  Trash2, 
  Search, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  LayoutGrid, 
  List, 
  CreditCard, 
  Star, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit3,
  SlidersHorizontal,
  Package
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { confirm } = usePopup();
  
  // Filtering & View State
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [viewMode, setViewMode] = useState('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getReviews();
      setReviews(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, filterRating, itemsPerPage]);

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await adminApi.approveReview(id, !currentStatus);
      setReviews(prev =>
        prev.map(r => (r._id === id ? { ...r, approved: !currentStatus } : r))
      );
      toast.success(currentStatus ? 'Review approval revoked' : 'Review approved successfully');
    } catch (error) {
      console.error('Failed to update review status:', error);
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Are you sure you want to delete this review?', { title: 'Delete Review?' });
    if (isConfirmed) {
      try {
        await adminApi.deleteReview(id);
        setReviews(prev => prev.filter(r => r._id !== id));
        toast.success('Review deleted successfully');
      } catch (error) {
        console.error('Failed to delete review:', error);
        toast.error('Failed to delete review');
      }
    }
  };

  const totalReviewsCount = reviews.length;
  const approvedReviewsCount = reviews.filter(r => r.approved).length;
  const pendingReviewsCount = reviews.filter(r => !r.approved).length;
  const rejectedReviewsCount = reviews.filter(r => r.rejected || r.status === 'rejected').length;
  
  const approvedPercentage = totalReviewsCount > 0 ? Math.round((approvedReviewsCount / totalReviewsCount) * 100) : 0;
  const pendingPercentage = totalReviewsCount > 0 ? Math.round((pendingReviewsCount / totalReviewsCount) * 100) : 0;
  const rejectedPercentage = totalReviewsCount > 0 ? Math.round((rejectedReviewsCount / totalReviewsCount) * 100) : 0;

  const averageRating = useMemo(() => {
    if (totalReviewsCount === 0) return '0.0';
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return (sum / totalReviewsCount).toFixed(1);
  }, [reviews, totalReviewsCount]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch =
        (r.product?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.product?.sku || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.comment || '').toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'approved' && r.approved) ||
        (filterStatus === 'pending' && !r.approved);

      const matchesRating =
        filterRating === 'all' || r.rating === Number(filterRating);

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [reviews, search, filterStatus, filterRating]);

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  const renderStars = (rating = 0) => (
    <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
        />
      ))}
    </div>
  );

  const renderStatusBadge = (approved) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0 ${
        approved
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${approved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
      {approved ? 'Approved' : 'Pending'}
    </span>
  );

  const formatDate = (dateString) => {
    if (!dateString) return { date: '30/08/2026', time: '11:28 AM' };
    const d = new Date(dateString);
    const date = d.toLocaleDateString('en-GB'); 
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const renderActionButtons = (review) => (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        onClick={() => toast.info('View review details clicked')}
        className="p-2 text-slate-600 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors shadow-sm cursor-pointer"
        title="View Review"
      >
        <Eye size={15} />
      </button>
      <button
        onClick={() => handleToggleApproval(review._id, review.approved)}
        className={`p-2 rounded-lg transition-colors border shadow-sm cursor-pointer ${
          review.approved
            ? 'text-amber-600 bg-white hover:bg-amber-50 border-amber-200'
            : 'text-emerald-600 bg-white hover:bg-emerald-50 border-emerald-200'
        }`}
        title={review.approved ? 'Revoke Approval' : 'Approve Review'}
      >
        <Edit3 size={15} />
      </button>
      <button
        onClick={() => handleDelete(review._id)}
        className="text-red-500 hover:text-red-600 p-2 bg-white hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-200 transition-colors shadow-sm cursor-pointer"
        title="Delete Review"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Star className="fill-emerald-100" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Reviews</h1>
            <p className="text-slate-500 text-sm">Moderate and organize product ratings & user feedback.</p>
          </div>
        </div>
        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* 2. STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Star size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Reviews</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">{totalReviewsCount}</div>
          </div>
          <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">All time reviews</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approved Reviews</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">{approvedReviewsCount}</div>
          </div>
          <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">{approvedPercentage}% of total</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <MessageSquare size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Reviews</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">{pendingReviewsCount}</div>
          </div>
          <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">{pendingPercentage}% of total</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <XCircle size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Rejected Reviews</span>
            <div className="text-3xl font-bold text-slate-900 mt-1">{rejectedReviewsCount}</div>
          </div>
          <div className="text-xs text-slate-500 pt-1 border-t border-slate-100">{rejectedPercentage}% of total</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Star className="fill-blue-100" size={18} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average Rating</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900">{averageRating}</span>
            </div>
          </div>
          <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[11px] text-slate-400">Based on {totalReviewsCount} reviews</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN REVIEWS CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              placeholder="Search reviews, products, or users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
            </select>

            <select
              value={filterRating}
              onChange={e => setFilterRating(e.target.value)}
              className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List/Table View"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'card' ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Card Stack View"
              >
                <CreditCard size={16} />
              </button>
            </div>

            <button
              onClick={() => toast.info('Advanced filters options')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
          </div>
        </div>

        {/* 4. & 5. TABLE & VIEWS CONTENT */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <RefreshCw className="animate-spin text-emerald-600 mb-2" size={24} />
            <p className="text-slate-500 text-sm font-medium">Loading reviews...</p>
          </div>
        ) : paginatedReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-slate-900 font-semibold text-base">No reviews found</h3>
            <p className="text-slate-500 text-sm max-w-sm mt-1">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            {/* TABLE VIEW WITH 100% LAPTOP WIDTH & SCROLL SAFETY */}
            {viewMode === 'table' && (
              <div className="w-full overflow-x-auto">
                <table className="w-full table-auto text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-3.5 sm:px-6 sm:py-4">Product</th>
                      <th className="px-4 py-3.5 sm:px-6 sm:py-4">Customer</th>
                      <th className="px-4 py-3.5 sm:px-6 sm:py-4">Review Content</th>
                      <th className="px-4 py-3.5 sm:px-6 sm:py-4">Rating</th>
                      <th className="px-4 py-3.5 sm:px-6 sm:py-4">Status</th>
                      <th className="px-4 py-3.5 sm:px-6 sm:py-4">Date</th>
                      <th className="px-4 py-3.5 sm:px-6 sm:py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {paginatedReviews.map(review => {
                      const { date, time } = formatDate(review.createdAt);
                      const customerName = review.user?.name || 'Unknown User';
                      const firstLetter = customerName.charAt(0).toUpperCase();

                      return (
                        <tr key={review._id} className="hover:bg-slate-50/50 transition-colors">
                          {/* PRODUCT WITH IMAGE / FALLBACK */}
                          <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                                {review.product?.image || review.productImage || review.image ? (
                                  <img 
                                    src={review.product?.image || review.productImage || review.image} 
                                    alt={review.product?.name || 'Product'} 
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <Package className="text-slate-400" size={18} />
                                )}
                              </div>
                              <div className="min-w-0 max-w-[200px]">
                                <div className="font-semibold text-slate-900 text-sm truncate" title={review.product?.name || 'Unknown Product'}>
                                  {review.product?.name || 'Unknown Product'}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5 truncate">
                                  SKU: {review.product?.sku || review.sku || 'AFF-PRD-001'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* CUSTOMER */}
                          <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                                {firstLetter}
                              </div>
                              <div className="min-w-0 max-w-[160px]">
                                <div className="font-semibold text-slate-900 text-sm truncate" title={customerName}>
                                  {customerName}
                                </div>
                                <div className="text-xs text-slate-400 truncate" title={review.user?.email || 'user@example.com'}>
                                  {review.user?.email || 'user@example.com'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* REVIEW TITLE & COMMENT */}
                          <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                            <div className="max-w-xs space-y-1">
                              <p className="font-semibold text-slate-900 text-sm truncate" title={review.title || review.comment || 'Untitled'}>
                                {review.title || review.comment || 'Untitled'}
                              </p>
                              {review.verifiedPurchase !== false && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle size={10} /> Verified
                                </span>
                              )}
                            </div>
                          </td>

                          {/* RATING */}
                          <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                            <div className="space-y-1 whitespace-nowrap">
                              <span className="font-bold text-slate-900 text-sm">{review.rating}.0</span>
                              {renderStars(review.rating)}
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-3.5 sm:px-6 sm:py-4 whitespace-nowrap">
                            {renderStatusBadge(review.approved)}
                          </td>

                          {/* DATE */}
                          <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-xs whitespace-nowrap">
                            <div className="font-medium text-slate-900">{date}</div>
                            <div className="text-slate-400 mt-0.5">{time}</div>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-right whitespace-nowrap">
                            <div className="flex justify-end">{renderActionButtons(review)}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* GRID VIEW */}
            {viewMode === 'grid' && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedReviews.map(review => {
                  const { date, time } = formatDate(review.createdAt);
                  return (
                    <div
                      key={review._id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              {review.product?.image || review.productImage || review.image ? (
                                <img 
                                  src={review.product?.image || review.productImage || review.image} 
                                  alt="" 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <Package className="text-slate-400" size={14} />
                              )}
                            </div>
                            <span className="font-semibold text-xs text-slate-700 truncate max-w-[130px]">
                              {review.product?.name || 'Product'}
                            </span>
                          </div>
                          {renderStatusBadge(review.approved)}
                        </div>

                        <div>
                          {renderStars(review.rating)}
                          <h4 className="font-semibold text-slate-900 text-base mt-2">
                            {review.title || 'Untitled Review'}
                          </h4>
                          <p className="text-slate-600 text-sm mt-1 line-clamp-3">
                            {review.comment || 'No comment provided.'}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                            {review.user?.name || 'Unknown User'}
                          </p>
                          <p className="text-[11px] text-slate-400">{date} at {time}</p>
                        </div>
                        {renderActionButtons(review)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CARD VIEW */}
            {viewMode === 'card' && (
              <div className="p-6 space-y-3">
                {paginatedReviews.map(review => {
                  const { date, time } = formatDate(review.createdAt);
                  return (
                    <div
                      key={review._id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {review.product?.image || review.productImage || review.image ? (
                            <img 
                              src={review.product?.image || review.productImage || review.image} 
                              alt="" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Package className="text-slate-400" size={20} />
                          )}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-slate-900 truncate">
                              {review.product?.name || 'Unknown Product'}
                            </span>
                            {renderStars(review.rating)}
                            {renderStatusBadge(review.approved)}
                          </div>
                          <p className="text-xs text-slate-500">
                            By <span className="font-medium text-slate-700">{review.user?.name || 'Unknown User'}</span> ({date})
                          </p>
                          <p className="text-sm text-slate-700 pt-0.5 line-clamp-1">
                            <strong className="text-slate-900">{review.title || 'Review'}: </strong>
                            {review.comment}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        {renderActionButtons(review)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 6. PAGINATION */}
            <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>
                  Showing <strong className="text-slate-700">{filteredReviews.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-700">{Math.min(currentPage * itemsPerPage, filteredReviews.length)}</strong> of{' '}
                  <strong className="text-slate-700">{filteredReviews.length}</strong> reviews
                </span>
                
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <span>Items per page:</span>
                  <select
                    value={itemsPerPage}
                    onChange={e => setItemsPerPage(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-none cursor-pointer shadow-sm"
                  >
                    {ITEMS_PER_PAGE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  title="First Page"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                <button className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-950 text-white shadow-sm">
                  {currentPage}
                </button>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
                  title="Last Page"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}