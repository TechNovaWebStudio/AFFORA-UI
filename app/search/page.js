'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../../components/ui/ProductCard';
import { productApi } from '../../services/productApi';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';

const popularKeywords = ['Cloves', 'Black Pepper', 'Cardamom', 'Turmeric', 'Ginger', 'Whole Spices'];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      productApi.getAll({ search: searchTerm.trim() })
        .then((res) => {
          const list = res.data.products || res.data.data || res.data;
          setResults(Array.isArray(list) ? list : []);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-bold text-xs uppercase tracking-widest mb-3">
            <Search size={14} />
            <span>INSTANT SEARCH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-dark">
            Find Pure Indian Spices
          </h1>
        </div>

        {/* Liquid Glass Search Input Bar */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-brand-border/80 rounded-full shadow-glass p-2 transition-all focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10">
            <Search size={22} className="text-brand-textSub ml-4 shrink-0" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Cloves, Cardamom, Pepper, Turmeric..." 
              className="w-full bg-transparent px-4 py-2.5 text-brand-dark placeholder-brand-textSub/60 text-sm sm:text-base focus:outline-none"
              autoFocus
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="p-2 text-brand-textSub hover:text-brand-dark bg-brand-light rounded-full mr-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Popular Keyword Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-brand-textSub flex items-center gap-1">
            <Sparkles size={13} className="text-emerald-500" /> Popular:
          </span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setSearchTerm(kw)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-brand-border/70 text-brand-dark text-xs font-medium hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Search Results Display */}
        <div className="pt-6">
          {loading ? (
            <div className="py-16 text-center text-brand-textSub">
              <div className="w-10 h-10 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-medium">Searching AFFORA spice collection...</p>
            </div>
          ) : searchTerm && results.length === 0 ? (
            <div className="py-16 text-center bg-white/70 backdrop-blur-xl rounded-3xl border border-brand-border/60 max-w-lg mx-auto">
              <Search size={36} className="text-brand-textSub/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-brand-dark mb-1">No spices matched "{searchTerm}"</h3>
              <p className="text-xs text-brand-textSub mb-6">Try searching for Cloves, Cardamom, Black Pepper, or Turmeric.</p>
              <Link href="/products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full shadow-md">
                <span>Browse All Products</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm font-bold text-brand-dark">Found {results.length} product(s) for "{searchTerm}"</p>
                <Link href={`/products?search=${encodeURIComponent(searchTerm)}`} className="text-xs font-bold text-brand-primary hover:underline">
                  View in Shop Grid &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-brand-textSub/70 text-xs">
              Type keywords above to search authentic Indian spices.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
