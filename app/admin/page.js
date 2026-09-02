'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { 
  IndianRupee, ShoppingCart, Users, Package, AlertTriangle, 
  Clock, TrendingUp, Calendar, Filter, ChevronDown
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('This Month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        let startDate = null;
        let endDate = new Date().toISOString();

        if (dateFilter === 'Today') {
          startDate = new Date(now.setHours(0,0,0,0)).toISOString();
        } else if (dateFilter === 'Yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          startDate = new Date(yesterday.setHours(0,0,0,0)).toISOString();
          const endYesterday = new Date(yesterday);
          endYesterday.setHours(23,59,59,999);
          endDate = endYesterday.toISOString();
        } else if (dateFilter === 'Last 7 Days') {
          const lastWeek = new Date(now);
          lastWeek.setDate(now.getDate() - 7);
          startDate = lastWeek.toISOString();
        } else if (dateFilter === 'This Month') {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        } else if (dateFilter === 'Last Month') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          startDate = lastMonth.toISOString();
          const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
          endDate = endLastMonth.toISOString();
        } else if (dateFilter === 'This Year') {
          startDate = new Date(now.getFullYear(), 0, 1).toISOString();
        }

        const [statsRes, ordersRes] = await Promise.all([
          adminApi.getStats(startDate ? { startDate, endDate } : {}),
          adminApi.getOrders()
        ]);
        setStatsData(statsRes.data?.data || statsRes.data || {});
        
        const allOrders = ordersRes.data?.data || ordersRes.data || [];
        setRecentOrders(Array.isArray(allOrders) ? allOrders.slice(0, 5) : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [dateFilter]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-brand-textSub text-xs font-bold">Loading AFFORA Analytics...</p>
      </div>
    );
  }

  const stats = [
    { name: 'Total Revenue', value: `₹${statsData?.totalSales?.toLocaleString() || 0}`, icon: IndianRupee, change: '+12%', isUp: true, color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    { name: 'Total Orders', value: statsData?.totalOrders || 0, icon: ShoppingCart, change: '+5%', isUp: true, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Customers', value: statsData?.totalCustomers || 0, icon: Users, change: '+18%', isUp: true, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Total Products', value: statsData?.totalProducts || 0, icon: Package, change: '-2%', isUp: false, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  // Dummy data for charts if API doesn't provide it yet
  const revenueData = statsData?.monthlySales?.length > 0 ? statsData.monthlySales : [
    { name: 'Jan', sales: 4000, orders: 24 },
    { name: 'Feb', sales: 3000, orders: 13 },
    { name: 'Mar', sales: 2000, orders: 98 },
    { name: 'Apr', sales: 2780, orders: 39 },
    { name: 'May', sales: 1890, orders: 48 },
    { name: 'Jun', sales: 2390, orders: 38 },
    { name: 'Jul', sales: 3490, orders: 43 },
  ];
  
  const orderStatusData = [
    { name: 'Pending', value: statsData?.pendingOrders || 12, color: '#f59e0b' },
    { name: 'Processing', value: 8, color: '#3b82f6' },
    { name: 'Delivered', value: 45, color: '#10b981' },
    { name: 'Cancelled', value: 3, color: '#ef4444' },
  ];

  const lowStockProducts = statsData?.lowStockProducts || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-brand-dark">Dashboard</h1>
          <p className="text-xs text-brand-textSub mt-1">Live metrics, inventory tracking, and sales analytics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="glass-button-outline px-4 py-2 text-sm text-brand-dark font-semibold gap-2"
            >
              <Calendar size={16} className="text-brand-primary" />
              {dateFilter}
              <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 glass-card py-2 z-50 shadow-glass-lg border border-brand-border/60">
                {['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month', 'This Year'].map((range) => (
                  <button 
                    key={range}
                    onClick={() => { setDateFilter(range); setIsFilterOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-brand-textMain hover:bg-brand-primary/10 transition-colors"
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.name} 
              className="glass-card p-6 flex flex-col justify-between hover:shadow-glass-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                  {stat.isUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-display font-extrabold text-brand-dark">{stat.value}</p>
                <p className="text-brand-textSub text-xs font-bold uppercase tracking-wider mt-1">{stat.name}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Side Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Revenue Chart */}
        <div className="xl:col-span-2 glass-card p-6 min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-display font-bold text-brand-dark text-lg">Revenue Overview</h2>
              <p className="text-xs text-brand-textSub">Sales performance over time</p>
            </div>
            <button className="text-brand-textSub hover:text-brand-primary p-2 bg-brand-light rounded-lg transition-colors">
              <Filter size={16} />
            </button>
          </div>

          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#176B45" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#176B45" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0EAE4" />
                <XAxis dataKey={revenueData[0]?.name ? 'name' : 'month'} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5A6960' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5A6960' }} tickFormatter={(val) => `₹${val}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 32px 0 rgba(11, 51, 35, 0.08)' }}
                  formatter={(value) => [`₹${value}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#176B45" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Pie & Low Stock */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Order Status */}
          <div className="glass-card p-6 flex-1 flex flex-col">
            <h2 className="font-display font-bold text-brand-dark text-lg mb-2">Order Status</h2>
            <div className="flex-1 relative flex items-center justify-center min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-2xl font-display font-bold text-brand-dark">{statsData?.totalOrders || 0}</span>
                <span className="text-[10px] text-brand-textSub uppercase font-bold tracking-wider">Orders</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {orderStatusData.map(status => (
                <div key={status.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-brand-textSub">{status.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="glass-card p-6 border border-amber-200/60 bg-gradient-to-br from-white to-amber-50/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>Low Stock Alerts</span>
              </div>
              <Link href="/admin/inventory" className="text-[10px] uppercase font-bold text-brand-primary hover:underline">View All</Link>
            </div>
            
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-brand-textSub">All products have healthy inventory levels.</p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p._id} className="flex justify-between items-center text-xs p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <span className="font-bold text-brand-dark truncate max-w-[140px]">{p.name}</span>
                    <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders List */}
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display font-bold text-brand-dark text-lg">Recent Customer Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-brand-primary hover:bg-brand-primary/10 px-4 py-2 rounded-lg transition-colors">
            View All Orders &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-brand-textSub uppercase tracking-wider border-b border-brand-border/60">
              <tr>
                <th className="pb-3 font-bold">Order ID</th>
                <th className="pb-3 font-bold">Date</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Amount</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-brand-textSub">No recent orders recorded.</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-brand-light/50 transition-colors">
                    <td className="py-4 font-bold text-brand-dark">#{order.orderNumber || order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 text-brand-textSub">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-brand-dark">{order.user?.name || 'Guest User'}</td>
                    <td className="py-4 font-bold text-brand-dark">₹{order.total}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                        order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 
                        order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4">
                      <Link href={`/admin/orders/${order._id}`} className="text-brand-primary font-bold text-xs hover:underline">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
