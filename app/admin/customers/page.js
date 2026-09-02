'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, Users, CheckCircle, XCircle, LayoutGrid, List, Mail, Calendar, UserCheck, UserX, Eye, MoreVertical, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';

export default function AdminCustomersPage() {
  const { toast } = useToast();
  const { confirm } = usePopup();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownRef = useRef(null);
  const itemsPerPage = 5;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCustomers();
      setCustomers(res.data.users || res.data.data || res.data || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset page to 1 whenever search, role filter, or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  const handleToggleStatus = async (id, currentStatus) => {
    const isConfirmed = await confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'activate'} this customer?`);
    if (isConfirmed) {
      try {
        await adminApi.toggleCustomerStatus(id);
        setCustomers(customers.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c));
        toast.success(`Customer ${currentStatus ? 'suspended' : 'activated'} successfully`);
      } catch (error) {
        toast.error(error?.message || 'Failed to update customer status');
      }
    }
  };

  const filteredCustomers = customers.filter(c => {
    const searchLower = search.toLowerCase();
    const matchesSearch = c.name?.toLowerCase().includes(searchLower) || c.email?.toLowerCase().includes(searchLower);
    const matchesRole = roleFilter === 'All' || roleFilter === 'All Roles' || c.role?.toLowerCase() === roleFilter.toLowerCase();
    
    const isActive = c.isActive !== false;
    const matchesStatus = statusFilter === 'All' || statusFilter === 'All Status' || 
      (statusFilter === 'Active' && isActive) || 
      (statusFilter === 'Suspended' && !isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const showingStart = filteredCustomers.length > 0 ? indexOfFirstItem + 1 : 0;
  const showingEnd = Math.min(indexOfLastItem, filteredCustomers.length);

  // Stat calculations
  const totalUsers = customers.length;
  const activeUsers = customers.filter(c => c.isActive !== false).length;
  const suspendedUsers = customers.filter(c => c.isActive === false).length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const newThisMonth = customers.filter(c => {
    if (!c.createdAt) return false;
    const d = new Date(c.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const formatJoinedDate = (dateString) => {
    if (!dateString) return { date: '—', time: '' };
    const d = new Date(dateString);
    const date = d.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const getOrderCount = (c) => {
    return c.orderCount ?? c.ordersCount ?? (Array.isArray(c.orders) ? c.orders.length : 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-brand-textSub text-xs font-bold">Loading Customer Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner">
              <Users size={20} />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-brand-dark">Customers</h1>
          </div>
          <p className="text-brand-textSub text-xs mt-1 ml-[52px]">View and manage registered users, their roles, and activity.</p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers */}
        <div className="glass-card p-5 flex items-center justify-between rounded-2xl bg-white/80 border border-brand-border/60 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-textSub tracking-wider">Total Customers</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{totalUsers}</p>
            <p className="text-[11px] text-brand-textSub mt-0.5">All registered users</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner">
            <Users size={22} />
          </div>
        </div>

        {/* Active Users */}
        <div className="glass-card p-5 flex items-center justify-between rounded-2xl bg-white/80 border border-brand-border/60 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-textSub tracking-wider">Active Users</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{activeUsers}</p>
            <p className="text-[11px] text-brand-textSub mt-0.5">Currently active users</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-inner">
            <Users size={22} />
          </div>
        </div>

        {/* Suspended Users */}
        <div className="glass-card p-5 flex items-center justify-between rounded-2xl bg-white/80 border border-brand-border/60 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-textSub tracking-wider">Suspended Users</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{suspendedUsers}</p>
            <p className="text-[11px] text-brand-textSub mt-0.5">Users with restricted access</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 shadow-inner">
            <UserX size={22} />
          </div>
        </div>

        {/* New This Month */}
        <div className="glass-card p-5 flex items-center justify-between rounded-2xl bg-white/80 border border-brand-border/60 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-textSub tracking-wider">New This Month</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{newThisMonth}</p>
            <p className="text-[11px] text-brand-textSub mt-0.5">Joined this month</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner">
            <Calendar size={22} />
          </div>
        </div>
      </div>

      {/* Customer Container */}
      <div className="glass-card overflow-hidden flex flex-col rounded-2xl border border-brand-border/60 bg-white/80 shadow-sm">
        {/* Top Toolbar */}
        <div className="p-4 border-b border-brand-border/40 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/40">
          {/* Search Input on Left */}
          <div className="relative w-full md:max-w-md group">
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input pl-10 pr-4 py-2 text-sm bg-white border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub group-focus-within:text-brand-primary transition-colors" />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Status Filter */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark bg-white px-3 py-2 rounded-xl border border-brand-border/60 shadow-sm">
              <span className="text-brand-textSub flex items-center gap-1"><Filter size={13} /> Filter:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-brand-dark cursor-pointer font-bold"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-dark bg-white px-3 py-2 rounded-xl border border-brand-border/60 shadow-sm">
              <span className="text-brand-textSub flex items-center gap-1"><Users size={13} /> Role:</span>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-brand-dark cursor-pointer font-bold"
              >
                <option value="All">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Table / Grid Toggle */}
            <div className="flex items-center bg-brand-light p-1 rounded-xl border border-brand-border/60 gap-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-white shadow-sm text-brand-primary font-bold' : 'text-brand-textSub hover:text-brand-dark'
                }`}
                title="Table View"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-brand-primary font-bold' : 'text-brand-textSub hover:text-brand-dark'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        {filteredCustomers.length === 0 ? (
          <div className="px-6 py-16 text-center text-brand-textSub">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mb-3 shadow-inner">
                <Users size={24} className="text-brand-border" />
              </div>
              <p className="font-bold text-brand-dark">No customers found.</p>
              <p className="text-xs text-brand-textSub mt-1">Try adjusting your search or filter criteria.</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* Table Layout */
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
              <thead className="bg-brand-light/30 border-b border-brand-border/40 text-[10px] uppercase font-bold text-brand-textSub tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {currentCustomers.map((customer) => {
                  const isActive = customer.isActive !== false;
                  const { date, time } = formatJoinedDate(customer.createdAt);
                  const orderCount = getOrderCount(customer);

                  return (
                    <tr key={customer._id} className="hover:bg-brand-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-extrabold text-sm shadow-inner shrink-0">
                            {customer.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <span className="font-bold text-sm text-brand-dark">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-brand-textSub">{customer.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-brand-light text-brand-textSub border border-brand-border">
                          {customer.role || 'customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-brand-dark">{date}</span>
                          <span className="text-[10px] text-brand-textSub font-medium">{time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border shadow-sm ${
                          isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          {isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-brand-dark">{orderCount}</span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <div className="flex items-center justify-end gap-1.5" ref={activeDropdown === customer._id ? dropdownRef : null}>
                          {/* Eye view button */}
                          <button
                            onClick={() => toast.info(`Viewing customer: ${customer.name}`)}
                            className="p-1.5 rounded-lg border border-brand-border/60 text-brand-textSub hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
                            title="View Customer"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Three-dot menu button */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === customer._id ? null : customer._id)}
                              className="p-1.5 rounded-lg border border-brand-border/60 text-brand-textSub hover:text-brand-dark hover:bg-brand-light transition-all"
                              title="Actions"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === customer._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-brand-border/80 py-1.5 z-20 text-left">
                                <button
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    toast.info(`Viewing customer: ${customer.name}`);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-light flex items-center gap-2"
                                >
                                  <Eye size={14} className="text-brand-primary" /> View Customer
                                </button>
                                {customer.role !== 'admin' && (
                                  <button
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      handleToggleStatus(customer._id, isActive);
                                    }}
                                    className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
                                      isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                  >
                                    {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                    {isActive ? 'Suspend Customer' : 'Activate Customer'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View Layout */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-brand-light/10">
            {currentCustomers.map((customer) => {
              const isActive = customer.isActive !== false;
              const { date, time } = formatJoinedDate(customer.createdAt);
              const orderCount = getOrderCount(customer);

              return (
                <div 
                  key={customer._id} 
                  className="bg-white border border-brand-border/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-brand-primary/40 transition-all shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-extrabold text-lg shadow-inner shrink-0">
                          {customer.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-brand-dark leading-snug">{customer.name}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase mt-1 bg-brand-light text-brand-textSub border border-brand-border">
                            {customer.role || 'customer'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-brand-border/40 space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-brand-textSub">
                        <Mail size={14} className="text-brand-primary shrink-0" />
                        <span className="truncate font-medium">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-brand-textSub">
                        <Calendar size={14} className="text-brand-primary shrink-0" />
                        <span className="font-medium">Joined: {date} at {time}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-brand-textSub font-medium">Orders:</span>
                        <span className="font-bold text-brand-dark">{orderCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-brand-border/40 flex items-center justify-between relative" ref={activeDropdown === customer._id ? dropdownRef : null}>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border shadow-sm ${
                      isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {isActive ? 'Active' : 'Suspended'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toast.info(`Viewing customer: ${customer.name}`)}
                        className="p-1.5 rounded-lg border border-brand-border/60 text-brand-textSub hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
                        title="View Customer"
                      >
                        <Eye size={16} />
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === customer._id ? null : customer._id)}
                          className="p-1.5 rounded-lg border border-brand-border/60 text-brand-textSub hover:text-brand-dark hover:bg-brand-light transition-all"
                          title="Actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeDropdown === customer._id && (
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-brand-border/80 py-1.5 z-20 text-left">
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                toast.info(`Viewing customer: ${customer.name}`);
                              }}
                              className="w-full px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-light flex items-center gap-2"
                            >
                              <Eye size={14} className="text-brand-primary" /> View Customer
                            </button>
                            {customer.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  setActiveDropdown(null);
                                  handleToggleStatus(customer._id, isActive);
                                }}
                                className={`w-full px-4 py-2 text-xs font-semibold flex items-center gap-2 ${
                                  isActive ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                {isActive ? 'Suspend Customer' : 'Activate Customer'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40">
          <p className="text-xs text-brand-textSub font-medium">
            Showing {showingStart} to {showingEnd} of {filteredCustomers.length} customers
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-brand-border/60 bg-white text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 bg-brand-primary text-white font-bold text-xs rounded-lg shadow-sm">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-brand-border/60 bg-white text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-light transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}