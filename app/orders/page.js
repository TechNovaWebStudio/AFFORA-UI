'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import { orderApi } from '../../services/orderApi';
import { useAuth } from '../../context/AuthContext';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    orderApi.getMyOrders()
      .then(res => setOrders(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-brand-textSub text-sm">Fetching your AFFORA orders...</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">Shipped</span>;
      case 'processing':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">Processing</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">Pending</span>;
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-extrabold uppercase tracking-wider mb-2">
              <Package size={14} />
              <span>ORDER HISTORY</span>
            </div>
            <h1 className="text-3xl font-display font-extrabold text-brand-dark">My Spice Orders</h1>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full shadow-md hover:bg-brand-primaryHover transition-colors">
            <ShoppingBag size={15} />
            <span>Order More Spices</span>
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-3xl p-12 text-center shadow-glass max-w-md mx-auto">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
              <Package size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-brand-dark mb-2">No orders placed yet</h3>
            <p className="text-brand-textSub text-xs mb-6">Discover authentic Indian cloves, black pepper, green cardamom, turmeric and dry ginger.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-xs font-bold rounded-full shadow-md">
              <span>Explore Collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-3xl p-6 shadow-glass space-y-6"
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-border/50">
                  <div>
                    <span className="text-xs font-bold text-brand-textSub block">Order #{order.orderNumber}</span>
                    <span className="text-xs text-brand-textSub">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.orderStatus)}
                    <span className="text-lg font-display font-bold text-brand-dark">₹{order.total}</span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="grid grid-cols-4 gap-2 text-center py-2 bg-brand-light/40 rounded-2xl p-4 border border-brand-border/40">
                  <div className="flex flex-col items-center">
                    <CheckCircle size={18} className="text-emerald-600 mb-1" />
                    <span className="text-[10px] font-bold text-brand-dark">Confirmed</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock size={18} className={['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? "text-emerald-600 mb-1" : "text-gray-400 mb-1"} />
                    <span className="text-[10px] font-bold text-brand-dark">Processing</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck size={18} className={['shipped', 'delivered'].includes(order.orderStatus) ? "text-emerald-600 mb-1" : "text-gray-400 mb-1"} />
                    <span className="text-[10px] font-bold text-brand-dark">Shipped</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CheckCircle size={18} className={order.orderStatus === 'delivered' ? "text-emerald-600 mb-1" : "text-gray-400 mb-1"} />
                    <span className="text-[10px] font-bold text-brand-dark">Delivered</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-2 bg-white rounded-2xl border border-brand-border/40">
                      <div className="w-12 h-12 bg-brand-light rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img src={item.image || '/hero.png'} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-brand-dark text-xs">{item.name}</p>
                        <p className="text-[11px] text-brand-textSub">{item.weight || '100g'} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-brand-dark text-xs">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
