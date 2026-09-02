import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl border border-brand-border shadow-sm">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-8 text-center">Terms of Service</h1>
        
        <div className="space-y-6 text-brand-textSub text-sm md:text-base leading-relaxed">
          <p>Last updated: August 2026</p>
          
          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing and using the AFFORA website, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">2. Products and Pricing</h2>
          <p>All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </div>
      </div>
    </div>
  );
}
