'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Package, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AccountDashboard() {
  const { user } = useAuth();

  return (
    <div className="w-full bg-white p-5 sm:p-8 rounded-2xl border border-brand-border shadow-sm">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-brand-border gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-dark">
            Hello, {user?.name || 'Valued Customer'}! 👋
          </h2>
          <p className="text-sm text-brand-textSub mt-1">
            Manage your orders, saved delivery addresses, and personal security settings.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-green-200">
          <ShieldCheck size={14} />
          <span>Verified Account</span>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
        
        {/* Recent Orders Card */}
        <div className="p-5 border border-brand-border rounded-xl bg-brand-light flex flex-col justify-between hover:border-brand-primary transition-all group">
          <div>
            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-primary mb-3">
              <Package size={20} />
            </div>
            <h3 className="font-semibold text-brand-dark text-base mb-1">Recent Orders</h3>
            <p className="text-xs sm:text-sm text-brand-textSub mb-4">
              Track, return, or buy items again from your past order history.
            </p>
          </div>
          <Link 
            href="/account/orders" 
            className="inline-flex items-center gap-2 text-sm text-brand-primary font-semibold group-hover:underline"
          >
            <span>View Orders</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Saved Addresses Card */}
        <div className="p-5 border border-brand-border rounded-xl bg-brand-light flex flex-col justify-between hover:border-brand-primary transition-all group">
          <div>
            <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-primary mb-3">
              <MapPin size={20} />
            </div>
            <h3 className="font-semibold text-brand-dark text-base mb-1">Saved Addresses</h3>
            <p className="text-xs sm:text-sm text-brand-textSub mb-2">
              {user?.address?.length || 0} delivery address{user?.address?.length === 1 ? '' : 'es'} saved on file.
            </p>
          </div>
          <Link 
            href="/account/addresses" 
            className="inline-flex items-center gap-2 text-sm text-brand-primary font-semibold group-hover:underline mt-4"
          >
            <span>Manage Addresses</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}