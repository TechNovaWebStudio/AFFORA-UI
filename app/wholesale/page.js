'use client';

import React from 'react';
export const dynamic = 'force-dynamic';
import GlassButton from '../../components/ui/GlassButton';

export default function WholesalePage() {
  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4 text-center">Wholesale Inquiries</h1>
        <p className="text-brand-textSub text-center mb-12 max-w-xl mx-auto">
          Partner with AFFORA to bring premium, sustainable Indian spices to your restaurant, bakery, or retail store.
        </p>

        <div className="bg-white p-8 rounded-3xl border border-brand-border shadow-sm">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-textMain mb-1">Business Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-textMain mb-1">Contact Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-textMain mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-textMain mb-1">Estimated Monthly Volume (in kg)</label>
              <select className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary bg-white text-brand-textMain">
                <option>Less than 10 kg</option>
                <option>10 - 50 kg</option>
                <option>50 - 100 kg</option>
                <option>100+ kg</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-textMain mb-1">Message / Specific Requirements</label>
              <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary"></textarea>
            </div>
            <GlassButton variant="primary" className="w-full">Submit Inquiry</GlassButton>
          </form>
        </div>
      </div>
    </div>
  );
}
