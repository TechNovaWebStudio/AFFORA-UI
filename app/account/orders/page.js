'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { orderApi } from '../../../services/orderApi';
import GlassButton from '../../../components/ui/GlassButton';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center">Loading orders...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
      <h2 className="text-2xl font-display font-semibold text-brand-dark mb-6">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 text-brand-primary">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-semibold text-brand-dark mb-2">No orders yet</h3>
          <p className="text-brand-textSub mb-6">Looks like you haven't made your first purchase.</p>
          <Link href="/products">
            <GlassButton variant="primary">Start Shopping</GlassButton>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order._id} href={`/account/orders/${order._id}`} className="block bg-brand-light/30 border border-brand-border rounded-xl p-4 hover:border-brand-primary transition-colors group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-brand-dark">#{order.orderNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                    `}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-brand-textSub">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                  <div className="text-right">
                    <p className="text-sm text-brand-textSub">Total Amount</p>
                    <p className="font-semibold text-brand-dark">₹{order.total}</p>
                  </div>
                  <ChevronRight size={20} className="text-brand-textSub group-hover:text-brand-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
