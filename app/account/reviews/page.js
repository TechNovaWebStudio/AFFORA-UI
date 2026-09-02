'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MessageSquare } from 'lucide-react';
import GlassButton from '../../../components/ui/GlassButton';

export default function AccountReviewsPage() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
      <h2 className="text-xl font-display font-bold text-brand-dark mb-4">My Submitted Reviews</h2>
      <p className="text-brand-textSub text-xs mb-6">Manage your reviews for AFFORA Indian spices.</p>

      <div className="text-center py-12 bg-brand-light/30 rounded-2xl border border-brand-border/40">
        <MessageSquare size={32} className="text-brand-primary/40 mx-auto mb-3" />
        <p className="text-sm font-bold text-brand-dark mb-1">No reviews submitted yet</p>
        <p className="text-xs text-brand-textSub mb-6">Share your experience after purchasing our spices.</p>
        <Link href="/products">
          <GlassButton variant="primary">Shop Collection</GlassButton>
        </Link>
      </div>
    </div>
  );
}
