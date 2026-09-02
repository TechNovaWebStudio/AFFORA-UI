'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminApi } from '../../../services/adminApi';
import { 
  Search, 
  CreditCard, 
  RefreshCw, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  Undo2, 
  Filter, 
  CalendarDays, 
  Download, 
  List, 
  Grid2X2, 
  Copy, 
  UserRound, 
  Eye, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const itemsPerPage = 7;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders();
      setOrders(res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculations for summary stats
  const stats = useMemo(() => {
    const totalPayments = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const successfulCount = orders.filter(o => o.paymentStatus === 'paid').length;
    const pendingCount = orders.filter(o => o.paymentStatus === 'pending').length;
    const failedCount = orders.filter(o => o.paymentStatus === 'failed').length;
    const refundedOrders = orders.filter(o => o.paymentStatus === 'refunded');
    const refundedAmount = refundedOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const totalCount = orders.length;
    const successfulPct = totalCount ? ((successfulCount / totalCount) * 100).toFixed(2) : '0.00';
    const pendingPct = totalCount ? ((pendingCount / totalCount) * 100).toFixed(2) : '0.00';
    const failedPct = totalCount ? ((failedCount / totalCount) * 100).toFixed(2) : '0.00';

    return {
      totalPayments,
      totalCount,
      successfulCount,
      successfulPct,
      pendingCount,
      pendingPct,
      failedCount,
      failedPct,
      refundedAmount,
      refundedCount: refundedOrders.length
    };
  }, [orders]);

  // Filtering orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        (o.orderNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.paymentId || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.user?.email || '').toLowerCase().includes(search.toLowerCase());
        
      const matchesStatus = filterStatus === 'all' || o.paymentStatus === filterStatus;
      
      let matchesDate = true;
      if (dateRange !== 'all' && o.createdAt) {
        const orderDate = new Date(o.createdAt);
        const now = new Date();
        if (dateRange === 'today') {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (dateRange === '7days') {
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = orderDate >= sevenDaysAgo;
        } else if (dateRange === '30days') {
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          matchesDate = orderDate >= thirtyDaysAgo;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, search, filterStatus, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterStatus, dateRange]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(`Copied to clipboard: ${text}`);
  };

  const exportToCSV = () => {
    const headers = ['Order Number', 'Date', 'Payment ID', 'Customer', 'Email', 'Method', 'Amount', 'Status', 'Reference'];
    const rows = filteredOrders.map(o => [
      o.orderNumber || '',
      o.createdAt ? new Date(o.createdAt).toLocaleString() : '',
      o.paymentId || 'N/A',
      o.user?.name || 'Unknown',
      o.user?.email || '',
      o.paymentMethod || '',
      o.total || 0,
      o.paymentStatus || '',
      o.reference || o.paymentId || 'N/A'
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-brand-textSub text-sm font-medium">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-light border border-brand-border flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-brand-dark">Payments</h1>
            <p className="text-brand-textSub text-sm">View transaction history and payment statuses.</p>
          </div>
        </div>
        <button 
          onClick={fetchOrders}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-brand-border rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-light/50 transition-colors shadow-sm self-start md:self-auto"
        >
          <RefreshCw size={15} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* PAYMENT SUMMARY CARDS - Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 w-full">
        {/* Total Payments */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between w-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-brand-textSub uppercase">Total Payments</span>
              <div className="text-2xl font-bold text-brand-dark mt-1">{formatCurrency(stats.totalPayments)}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary border border-brand-border/50 shrink-0">
              <CreditCard size={18} />
            </div>
          </div>
          <span className="text-xs text-brand-textSub font-medium">From {stats.totalCount} transactions</span>
        </div>

        {/* Successful Payments */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between w-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-brand-textSub uppercase">Successful Payments</span>
              <div className="text-2xl font-bold text-brand-dark mt-1">{stats.successfulCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100 shrink-0">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <span className="text-xs text-brand-textSub font-medium">{stats.successfulPct}% of total</span>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between w-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-brand-textSub uppercase">Pending Payments</span>
              <div className="text-2xl font-bold text-brand-dark mt-1">{stats.pendingCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 border border-yellow-100 shrink-0">
              <Clock3 size={18} />
            </div>
          </div>
          <span className="text-xs text-brand-textSub font-medium">{stats.pendingPct}% of total</span>
        </div>

        {/* Failed Payments */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between w-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-brand-textSub uppercase">Failed Payments</span>
              <div className="text-2xl font-bold text-brand-dark mt-1">{stats.failedCount}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100 shrink-0">
              <XCircle size={18} />
            </div>
          </div>
          <span className="text-xs text-brand-textSub font-medium">{stats.failedPct}% of total</span>
        </div>

        {/* Refunded Amount */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1 w-full">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-brand-textSub uppercase">Refunded Amount</span>
              <div className="text-2xl font-bold text-brand-dark mt-1">{formatCurrency(stats.refundedAmount)}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
              <Undo2 size={18} />
            </div>
          </div>
          <span className="text-xs text-brand-textSub font-medium">From {stats.refundedCount} refunds</span>
        </div>
      </div>

      {/* MAIN PAYMENTS CONTAINER */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden w-full">
        {/* TOP TOOLBAR */}
        <div className="p-4 border-b border-brand-border flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
          <div className="relative w-full lg:max-w-md">
            <input 
              type="text"
              placeholder="Search by order number, payment ID, or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-brand-border rounded-xl text-sm focus:outline-none focus:border-brand-primary bg-brand-light/20"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-textSub">
                <Filter size={14} />
                <span>Filter:</span>
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-brand-border px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-brand-primary bg-white text-brand-dark font-medium"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Date Range Control */}
            <div className="relative">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 border border-brand-border px-3 py-2 rounded-xl text-sm bg-white text-brand-dark font-medium hover:bg-brand-light/40 transition-colors"
              >
                <CalendarDays size={15} className="text-brand-textSub" />
                <span>
                  {dateRange === 'all' ? 'Date Range' : 
                   dateRange === 'today' ? 'Today' : 
                   dateRange === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
                </span>
              </button>

              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-xl shadow-lg py-1 z-20">
                  <button 
                    onClick={() => { setDateRange('all'); setShowDatePicker(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-brand-light/50 ${dateRange === 'all' ? 'text-brand-primary font-bold' : 'text-brand-dark'}`}
                  >
                    All Time
                  </button>
                  <button 
                    onClick={() => { setDateRange('today'); setShowDatePicker(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-brand-light/50 ${dateRange === 'today' ? 'text-brand-primary font-bold' : 'text-brand-dark'}`}
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => { setDateRange('7days'); setShowDatePicker(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-brand-light/50 ${dateRange === '7days' ? 'text-brand-primary font-bold' : 'text-brand-dark'}`}
                  >
                    Last 7 Days
                  </button>
                  <button 
                    onClick={() => { setDateRange('30days'); setShowDatePicker(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-brand-light/50 ${dateRange === '30days' ? 'text-brand-primary font-bold' : 'text-brand-dark'}`}
                  >
                    Last 30 Days
                  </button>
                </div>
              )}
            </div>

            {/* Export Button */}
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 border border-brand-border px-3 py-2 rounded-xl text-sm bg-white text-brand-dark font-medium hover:bg-brand-light/40 transition-colors"
            >
              <Download size={15} className="text-brand-textSub" />
              <span>Export</span>
            </button>

            {/* Display Toggle Buttons */}
            <div className="flex items-center border border-brand-border rounded-xl bg-white p-0.5">
              <button className="p-1.5 rounded-lg bg-brand-primary text-white shadow-xs">
                <List size={15} />
              </button>
              <button className="p-1.5 rounded-lg text-brand-textSub hover:text-brand-dark transition-colors">
                <Grid2X2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* TABLE CONTAINER - FULL WIDTH 100% */}
        <div className="w-full overflow-x-auto min-h-[350px]">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-brand-light/40 border-b border-brand-border text-[11px] font-semibold text-brand-textSub uppercase tracking-wider">
                <th className="px-6 py-3.5">Order / Date</th>
                <th className="px-6 py-3.5">Payment ID</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Reference</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-sm">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center text-brand-textSub">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-border mb-3">
                        <CreditCard size={24} />
                      </div>
                      <p className="text-brand-dark font-medium text-base">No payments found.</p>
                      <p className="text-xs text-brand-textSub mt-1">Try adjusting your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const paymentId = order.paymentId;
                  const reference = order.reference || order.paymentId || 'N/A';
                  
                  return (
                    <tr key={order._id} className="hover:bg-brand-light/20 transition-colors">
                      {/* Order / Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <Link href={`/admin/orders/${order._id}`} className="font-semibold text-brand-primary hover:underline">
                            {order.orderNumber || 'N/A'}
                          </Link>
                          <span className="text-xs text-brand-textSub mt-0.5">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            }).replace(',', '') : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Payment ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paymentId ? (
                          <div className="flex items-center gap-1.5 font-mono text-xs text-brand-dark">
                            <span className="truncate max-w-[120px]">{paymentId}</span>
                            <button 
                              onClick={() => copyToClipboard(paymentId)}
                              className="text-brand-textSub hover:text-brand-primary transition-colors p-1 shrink-0"
                              title="Copy Payment ID"
                            >
                              <Copy size={13} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-brand-textSub">N/A</span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-brand-textSub shrink-0 mt-0.5">
                            <UserRound size={13} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-brand-dark leading-tight">{order.user?.name || 'Unknown User'}</span>
                            <span className="text-xs text-brand-textSub mt-0.5 truncate max-w-[150px]">{order.user?.email || 'No email'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Method */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col capitalize">
                          <span className="font-medium text-brand-dark">{order.paymentMethod || 'N/A'}</span>
                          <span className="text-xs text-brand-textSub mt-0.5">
                            {order.paymentMethod?.toLowerCase() === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-brand-dark">
                        {formatCurrency(order.total)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider ${
                          order.paymentStatus === 'paid' ? 'bg-green-100/70 text-green-800 border border-green-200/50' :
                          order.paymentStatus === 'pending' ? 'bg-yellow-100/70 text-yellow-800 border border-yellow-200/50' :
                          order.paymentStatus === 'refunded' ? 'bg-blue-100/70 text-blue-800 border border-blue-200/50' :
                          'bg-red-100/70 text-red-800 border border-red-200/50'
                        }`}>
                          {order.paymentStatus === 'paid' && <CheckCircle2 size={11} />}
                          {order.paymentStatus === 'pending' && <Clock3 size={11} />}
                          {order.paymentStatus === 'failed' && <XCircle size={11} />}
                          {order.paymentStatus === 'refunded' && <Undo2 size={11} />}
                          <span>{order.paymentStatus?.toUpperCase()}</span>
                        </span>
                      </td>

                      {/* Reference */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-brand-textSub">
                        {reference}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 relative">
                          <Link 
                            href={`/admin/orders/${order._id}`}
                            className="p-1.5 text-brand-textSub hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors"
                            title="View Order"
                          >
                            <Eye size={16} />
                          </Link>
                          
                          <div className="relative">
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === order._id ? null : order._id)}
                              className="p-1.5 text-brand-textSub hover:text-brand-dark hover:bg-brand-light rounded-lg transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeMenuId === order._id && (
                              <div className="absolute right-0 mt-1 w-36 bg-white border border-brand-border rounded-xl shadow-lg py-1 z-30 text-left">
                                <Link 
                                  href={`/admin/orders/${order._id}`}
                                  className="block px-4 py-2 text-xs font-medium text-brand-dark hover:bg-brand-light/50"
                                >
                                  View Order
                                </Link>
                                {paymentId && (
                                  <button 
                                    onClick={() => { copyToClipboard(paymentId); setActiveMenuId(null); }}
                                    className="w-full text-left px-4 py-2 text-xs font-medium text-brand-dark hover:bg-brand-light/50"
                                  >
                                    Copy Payment ID
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER / PAGINATION */}
        <div className="p-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-textSub w-full">
          <div>
            Showing {filteredOrders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} payments
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light/50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-3 py-1 bg-brand-primary text-white font-medium rounded-lg">
              {currentPage}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-brand-border bg-white text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light/50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}