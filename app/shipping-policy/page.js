import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl border border-brand-border shadow-sm">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-8 text-center">Shipping Policy</h1>
        
        <div className="space-y-6 text-brand-textSub text-sm md:text-base leading-relaxed">
          <p>Last updated: August 2026</p>
          
          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">1. Processing Time</h2>
          <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on Sundays or holidays.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout. We offer free shipping on all orders over ₹1,000 within India. Delivery typically takes 3-7 business days depending on your location.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">3. Shipment Confirmation & Order Tracking</h2>
          <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).</p>
        </div>
      </div>
    </div>
  );
}
