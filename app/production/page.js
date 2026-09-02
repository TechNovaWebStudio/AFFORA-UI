'use client';

import React from 'react';

export const dynamic = 'force-dynamic';

export default function Production() {
  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-6 text-center">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6">Production Journey</h1>
        <p className="text-brand-textSub text-lg leading-relaxed mb-8">
          From sourcing in remote Kerala farms to rigorous quality testing and premium eco-friendly packaging, trace the journey of an AFFORA spice.
        </p>
      </div>
    </div>
  );
}
