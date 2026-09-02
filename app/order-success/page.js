'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import GlassButton from '../../components/ui/GlassButton';
import { orderApi } from '../../services/orderApi';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      orderApi.getOrderById(orderId)
        .then(res => setOrder(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-brand-bg min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
        <CheckCircle size={48} strokeWidth={1.5} />
      </div>
      <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4 text-center">Order Confirmed!</h1>
      <p className="text-brand-textSub mb-2 text-center text-lg">Thank you for choosing AFFORA.</p>
      <p className="text-brand-textSub mb-8 text-center max-w-md text-sm">
        Your order {order ? <span className="font-bold text-brand-dark">#{order.orderNumber}</span> : 'has been placed'} successfully. 
        We'll send you an email confirmation shortly.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/account/orders">
          <GlassButton variant="primary">View Order Details</GlassButton>
        </Link>
        <Link href="/products">
          <GlassButton variant="outline">Continue Shopping</GlassButton>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

