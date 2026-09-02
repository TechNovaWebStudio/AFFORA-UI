import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl border border-brand-border shadow-sm">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-8 text-center">Refund Policy</h1>
        
        <div className="space-y-6 text-brand-textSub text-sm md:text-base leading-relaxed">
          <p>Last updated: August 2026</p>
          
          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">1. Returns</h2>
          <p>Due to the nature of our products (food items), we do not accept returns. If you receive a damaged or incorrect item, please contact us within 48 hours of delivery.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">2. Refunds</h2>
          <p>If your refund request for a damaged or incorrect item is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">3. Missing or late refunds</h2>
          <p>If you haven't received a refund yet, first check your bank account again. Then contact your credit card company or bank, as it may take some time before your refund is officially posted.</p>
        </div>
      </div>
    </div>
  );
}
