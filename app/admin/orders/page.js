'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Eye,
  Search,
  ShoppingCart,
  Filter,
  Calendar as CalendarIcon,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle2,
  LayoutGrid,
  List,
  Mail,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Truck,
  RotateCcw,
  XCircle,
  Phone,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getOrders();
      setOrders(res.data.orders || res.data.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset to first page when filtering or searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Dynamic Summary Metrics Calculation
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const paidOrders = orders.filter(o => o.isPaid);
    const unpaidOrders = orders.filter(o => !o.isPaid);
    const paidRevenue = paidOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const unpaidRevenue = unpaidOrders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
    const paidCount = paidOrders.length;
    const unpaidCount = unpaidOrders.length;

    const pendingCount = orders.filter(o => (o.orderStatus?.toLowerCase() || 'pending') === 'pending').length;
    const completedCount = orders.filter(o => o.orderStatus?.toLowerCase() === 'delivered').length;

    return { 
      totalOrders, 
      totalRevenue, 
      paidRevenue, 
      unpaidRevenue, 
      paidCount, 
      unpaidCount, 
      pendingCount, 
      completedCount 
    };
  }, [orders]);

  // Search & Status Filter
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const searchLower = search.toLowerCase();
      const idMatch = o._id?.toLowerCase().includes(searchLower) || o.orderNumber?.toLowerCase().includes(searchLower);
      const userMatch = o.user?.name?.toLowerCase().includes(searchLower) || 
                        o.user?.email?.toLowerCase().includes(searchLower) || 
                        o.shippingAddress?.fullName?.toLowerCase().includes(searchLower) ||
                        o.shippingAddress?.phone?.toLowerCase().includes(searchLower) ||
                        o.user?.phone?.toLowerCase().includes(searchLower);
      const statusMatch = statusFilter === 'All' || (o.orderStatus?.toLowerCase() || 'pending') === statusFilter.toLowerCase();
      
      return (idMatch || userMatch) && statusMatch;
    });
  }, [orders, search, statusFilter]);

  // Dynamic Pagination Calculation
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-brand-textSub text-xs font-bold">Loading Orders System...</p>
      </div>
    );
  }

  // Dynamic Order Status Badge Configurator
  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'delivered':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 size={12} className="mr-1" />
        };
      case 'shipped':
        return {
          color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          icon: <Truck size={12} className="mr-1" />
        };
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <RotateCcw size={12} className="mr-1" />
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <XCircle size={12} className="mr-1" />
        };
      default:
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Clock size={12} className="mr-1" />
        };
    }
  };

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center shadow-xs">
            <ShoppingCart size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold text-brand-dark">Orders</h1>
            <p className="text-brand-textSub text-xs mt-0.5">Live customer orders, financials, and fulfillment workflow.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark bg-white hover:bg-brand-primary/10 transition-colors px-3.5 py-2 rounded-xl border border-brand-border/60 whitespace-nowrap shadow-xs"
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Four Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-brand-textSub mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">GROSS REVENUE</span>
            <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-brand-dark">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-brand-textSub mt-2">From {metrics.totalOrders} total orders</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-brand-textSub mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">COLLECTED REVENUE</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-emerald-600">
            ₹{metrics.paidRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-brand-textSub mt-2">
            From {metrics.paidCount} {metrics.paidCount === 1 ? 'paid order' : 'paid orders'}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-brand-textSub mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">UNPAID BALANCE</span>
            <div className="p-2.5 bg-red-500/10 text-red-600 rounded-xl">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-red-600">
            ₹{metrics.unpaidRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-brand-textSub mt-2">
            From {metrics.unpaidCount} {metrics.unpaidCount === 1 ? 'order' : 'orders'}
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-brand-border/60 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-brand-textSub mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider">TOTAL ORDERS</span>
            <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl">
              <ShoppingCart size={16} />
            </div>
          </div>
          <div className="text-2xl font-display font-extrabold text-brand-dark">
            {metrics.totalOrders}
          </div>
          <p className="text-[11px] text-brand-textSub mt-2">Across all statuses</p>
        </div>
      </div>

      {/* Large Orders Container */}
      <div className="glass-card flex flex-col overflow-hidden rounded-[20px] border border-brand-border/60">
        
        {/* Search / Filter Toolbar */}
        <div className="p-4 border-b border-brand-border/40 flex flex-wrap items-center justify-between gap-3 bg-white/40">
          
          {/* Search input on left */}
          <div className="relative flex-1 min-w-[240px] md:max-w-[420px] group">
            <input 
              type="text"
              placeholder="Search by Order ID, Client, Email, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-2 text-xs text-brand-dark rounded-xl h-10 border border-brand-border/60 focus:outline-none focus:border-brand-primary shadow-xs"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub group-focus-within:text-brand-primary transition-colors" />
          </div>

          {/* Center/right: Filter Option & Select Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-white text-brand-dark border border-brand-border/60 hover:bg-brand-primary/5 transition-all shadow-xs"
              >
                <Filter size={13} className="text-brand-primary" />
                <span>Filter: <span className="text-brand-primary">{statusFilter}</span></span>
                <ChevronDown size={14} className={`text-brand-textSub transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Click-to-Select Dropdown Menu */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-brand-border/60 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-textSub border-b border-brand-border/30">
                    Select Status
                  </div>
                  {statuses.map(s => {
                    const active = statusFilter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          setStatusFilter(s);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-bold transition-colors flex items-center justify-between ${
                          active
                            ? 'bg-brand-primary/10 text-brand-primary'
                            : 'text-brand-dark hover:bg-brand-light'
                        }`}
                      >
                        <span>{s}</span>
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Far right: Table/Grid Toggle */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-brand-border/60 shrink-0 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-textSub hover:text-brand-dark'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-primary text-white shadow-xs' : 'text-brand-textSub hover:text-brand-dark'}`}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Content View Area */}
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-brand-textSub">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-3 shadow-inner">
                <ShoppingCart size={24} className="text-brand-border" />
              </div>
              <p className="font-bold text-brand-dark">No orders found.</p>
              <p className="text-xs mt-1">Try adjusting your search criteria or status filter.</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* Table Structure with 100% width and zero horizontal scrolling on laptops */
          <div className="w-full overflow-x-hidden">
            <table className="w-full text-left text-sm border-collapse table-fixed">
              <thead className="bg-brand-light/30 border-b border-brand-border/40 text-[10px] uppercase font-bold text-brand-textSub tracking-wider">
                <tr>
                  <th className="px-3.5 py-4 w-[13%]">Order ID</th>
                  <th className="px-3.5 py-4 w-[18%]">Customer</th>
                  <th className="px-3.5 py-4 w-[11%]">Date</th>
                  <th className="px-3.5 py-4 w-[11%]">Total Amount</th>
                  <th className="px-3.5 py-4 w-[10%]">Payment</th>
                  <th className="px-3.5 py-4 w-[12%]">Status</th>
                  <th className="px-3.5 py-4 w-[13%]">Shipping</th>
                  <th className="px-3.5 py-4 w-[12%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {paginatedOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.orderStatus);
                  const itemCount = order.orderItems?.length || order.items?.length || 1;
                  const customerName = order.user?.name || order.shippingAddress?.fullName || 'Guest User';
                  const customerEmail = order.user?.email || order.shippingAddress?.email;
                  const customerPhone = order.shippingAddress?.phone || order.user?.phone;
                  const trackingNum = order.trackingNumber || order.shippingInfo?.trackingNumber || order.shipment?.trackingNumber;
                  const shippingDate = order.shippingDate || order.deliveredAt || order.updatedAt;

                  return (
                    <tr key={order._id} className="hover:bg-brand-primary/5 transition-colors group h-[68px]">
                      {/* ORDER ID COLUMN */}
                      <td className="px-3.5 py-3.5 truncate">
                        <div>
                          <Link href={`/admin/orders/${order._id}`} className="font-bold text-brand-dark text-xs hover:text-brand-primary transition-colors block truncate">
                            #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                          </Link>
                          <span className="text-[10px] font-semibold text-brand-textSub mt-0.5 flex items-center gap-1">
                            <CalendarIcon size={10} /> {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </td>

                      {/* CUSTOMER COLUMN */}
                      <td className="px-3.5 py-3.5 truncate">
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-brand-dark font-bold text-xs truncate flex items-center gap-1">
                            <User size={10} className="text-brand-textSub shrink-0" />
                            {customerName}
                          </span>
                          {customerEmail && (
                            <span className="text-brand-textSub text-[10px] font-medium flex items-center gap-1 truncate">
                              <Mail size={9} className="shrink-0" />
                              {customerEmail}
                            </span>
                          )}
                          {customerPhone && (
                            <span className="text-brand-textSub text-[10px] font-medium flex items-center gap-1 truncate">
                              <Phone size={9} className="shrink-0" />
                              {customerPhone}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* DATE COLUMN */}
                      <td className="px-3.5 py-3.5 truncate">
                        <div className="flex flex-col">
                          <span className="text-brand-dark text-xs font-semibold truncate">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </span>
                          <span className="text-brand-textSub text-[10px] truncate">
                            {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* TOTAL AMOUNT COLUMN */}
                      <td className="px-3.5 py-3.5 truncate">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-brand-dark truncate">
                            ₹{order.total}
                          </span>
                          <span className="text-[10px] text-brand-textSub font-medium truncate">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>

                      {/* PAYMENT COLUMN */}
                      <td className="px-3.5 py-3.5 truncate">
                        <div className="flex flex-col items-start space-y-0.5">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                            order.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {order.isPaid ? 'PAID' : 'UNPAID'}
                          </span>
                          <span className="text-[10px] text-brand-textSub font-medium truncate">
                            {order.paymentMethod || 'Online'}
                          </span>
                        </div>
                      </td>

                      {/* STATUS COLUMN */}
                      <td className="px-3.5 py-3.5 truncate">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase border shadow-xs truncate ${statusBadge.color}`}>
                          {statusBadge.icon}
                          <span className="truncate">{order.orderStatus || 'Pending'}</span>
                        </span>
                      </td>

                      {/* SHIPPING COLUMN */}
                      <td className="px-3.5 py-3.5 truncate">
                        {trackingNum ? (
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-brand-dark truncate">{trackingNum}</span>
                            {shippingDate && (
                              <span className="text-[10px] text-brand-textSub truncate">
                                {new Date(shippingDate).toLocaleDateString('en-IN')}
                              </span>
                            )}
                          </div>
                        ) : order.orderStatus?.toLowerCase() === 'delivered' ? (
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-bold text-emerald-600 truncate">DELIVERED</span>
                            {shippingDate && (
                              <span className="text-[10px] text-brand-textSub truncate">
                                {new Date(shippingDate).toLocaleDateString('en-IN')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-brand-textSub text-xs">—</span>
                        )}
                      </td>

                      {/* ACTION COLUMN */}
                      <td className="px-3.5 py-3.5 text-right truncate">
                        <div className="flex items-center justify-end gap-1">
                          <Link 
                            href={`/admin/orders/${order._id}`} 
                            title="View Details"
                            className="p-1.5 text-brand-dark hover:text-brand-primary bg-white border border-brand-border/60 rounded-lg hover:bg-brand-primary/10 transition-colors shadow-xs"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            title="More Actions"
                            className="p-1.5 text-brand-textSub hover:text-brand-dark bg-white border border-brand-border/60 rounded-lg hover:bg-brand-light transition-colors shadow-xs"
                          >
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid Layout Mode */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedOrders.map((order) => {
              const statusBadge = getStatusBadge(order.orderStatus);
              const itemCount = order.orderItems?.length || order.items?.length || 1;
              const customerName = order.user?.name || order.shippingAddress?.fullName || 'Guest User';
              const customerEmail = order.user?.email || order.shippingAddress?.email;
              const customerPhone = order.shippingAddress?.phone || order.user?.phone;

              return (
                <div key={order._id} className="p-4 rounded-xl border border-brand-border/60 bg-white/60 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-brand-border/30">
                      <div>
                        <Link href={`/admin/orders/${order._id}`} className="font-bold text-brand-dark text-sm hover:text-brand-primary transition-colors block">
                          #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </Link>
                        <span className="text-[10px] font-semibold text-brand-textSub mt-0.5 flex items-center gap-1">
                          <CalendarIcon size={10} /> {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {order.orderStatus || 'Pending'}
                      </span>
                    </div>

                    <div className="py-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-brand-textSub font-medium flex items-center gap-1">
                          <User size={12} /> Customer:
                        </span>
                        <span className="font-bold text-brand-dark max-w-[150px] truncate">
                          {customerName}
                        </span>
                      </div>
                      {customerEmail && (
                        <div className="flex items-center justify-between">
                          <span className="text-brand-textSub font-medium flex items-center gap-1">
                            <Mail size={12} /> Email:
                          </span>
                          <span className="font-medium text-brand-textSub max-w-[150px] truncate">
                            {customerEmail}
                          </span>
                        </div>
                      )}
                      {customerPhone && (
                        <div className="flex items-center justify-between">
                          <span className="text-brand-textSub font-medium flex items-center gap-1">
                            <Phone size={12} /> Phone:
                          </span>
                          <span className="font-medium text-brand-textSub max-w-[150px] truncate">
                            {customerPhone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-brand-textSub block font-semibold">Total Amount</span>
                      <span className="text-base font-extrabold text-brand-dark">
                        ₹{order.total} <span className="text-xs font-normal text-brand-textSub">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Link 
                        href={`/admin/orders/${order._id}`} 
                        title="View Details"
                        className="p-2 text-brand-dark hover:text-brand-primary bg-brand-light rounded-lg border border-brand-border/60 hover:bg-brand-primary/10 transition-colors"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        title="More Actions"
                        className="p-2 text-brand-textSub hover:text-brand-dark bg-brand-light rounded-lg border border-brand-border/60 hover:bg-white transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Restyled Pagination Bar matching screenshot */}
        <div className="px-6 py-4 border-t border-brand-border/40 bg-white/40 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-textSub gap-3">
          <div>
            Showing {filteredOrders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length} orders
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-border/60 bg-white hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed text-brand-dark transition-colors shadow-xs"
              >
                <ChevronLeft size={16} />
              </button>
              
              <button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary text-white font-bold shadow-xs"
              >
                {currentPage}
              </button>

              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-border/60 bg-white hover:bg-brand-light disabled:opacity-40 disabled:cursor-not-allowed text-brand-dark transition-colors shadow-xs"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}