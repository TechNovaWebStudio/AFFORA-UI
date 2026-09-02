'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { orderApi } from '../../../../services/orderApi';
import GlassButton from '../../../../components/ui/GlassButton';

export default function OrderDetailsPage({ params }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi.getOrderById(params.id)
      .then(res => setOrder(res.data))
      .catch(err => setError(err.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="py-20 text-center">Loading order details...</div>;
  if (error) return <div className="py-20 text-center text-red-500">{error}</div>;
  if (!order) return <div className="py-20 text-center">Order not found</div>;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'processing': return <Package size={24} className="text-blue-500" />;
      case 'shipped': return <Truck size={24} className="text-yellow-500" />;
      case 'delivered': return <CheckCircle size={24} className="text-green-500" />;
      default: return <Package size={24} className="text-brand-textSub" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-brand-border">
        <Link href="/account/orders" className="text-brand-textSub hover:text-brand-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-display font-semibold text-brand-dark">Order #{order.orderNumber}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-brand-light/30 rounded-xl p-4 border border-brand-border flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              {getStatusIcon(order.orderStatus)}
            </div>
            <div>
              <h3 className="font-semibold text-brand-dark capitalize">Order {order.orderStatus}</h3>
              <p className="text-sm text-brand-textSub">
                {order.orderStatus === 'pending' && 'We have received your order.'}
                {order.orderStatus === 'processing' && 'Your order is being prepared.'}
                {order.orderStatus === 'shipped' && 'Your order is on the way.'}
                {order.orderStatus === 'delivered' && 'Your order has been delivered.'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-brand-dark mb-4">Items in this order</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item._id} className="flex items-center gap-4 border border-brand-border rounded-xl p-3">
                  <div className="w-16 h-16 bg-brand-light rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-brand-textSub">No Image</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <Link href={`/products/${item.product.slug || item.product._id}`} className="font-medium text-brand-dark hover:text-brand-primary transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm text-brand-textSub">Weight: {item.weight} | Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-brand-dark whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-brand-border rounded-xl p-4">
            <h3 className="font-semibold text-brand-dark mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-brand-textSub">
                <span>Subtotal</span>
                <span className="text-brand-dark">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-brand-textSub">
                <span>Shipping</span>
                <span className="text-brand-dark">₹{order.shipping}</span>
              </div>
              <div className="flex justify-between text-brand-textSub">
                <span>Tax</span>
                <span className="text-brand-dark">₹{order.tax}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-brand-dark pt-2 border-t border-brand-border mt-2">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          <div className="border border-brand-border rounded-xl p-4">
            <h3 className="font-semibold text-brand-dark mb-3">Shipping Details</h3>
            <p className="text-sm text-brand-textMain font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-brand-textSub mt-1">{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && <p className="text-sm text-brand-textSub">{order.shippingAddress.apartment}</p>}
            <p className="text-sm text-brand-textSub">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            <p className="text-sm text-brand-textSub mt-2">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
