'use client';

import React from 'react';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-white">
      <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6">
        <Search size={36} />
      </div>
      <h1 className="text-4xl font-display font-extrabold text-brand-dark mb-2">404 - Page Not Found</h1>
      <p className="text-brand-textSub max-w-md mb-8 text-sm sm:text-base">
        The spice page or resource you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-8 py-3.5 bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold rounded-full shadow-md transition-all flex items-center gap-2"
      >
        <span>Return to Homepage</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
