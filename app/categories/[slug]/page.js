'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../../../components/ui/ProductCard';
import { productApi } from '../../../services/productApi';
import { ArrowLeft, Grid, Search, Filter } from 'lucide-react';

export default function CategoryDetailPage({ params }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('recommended');

  const categoryName = params.slug
    ? params.slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Spice Collection';

  useEffect(() => {
    setLoading(true);
    productApi.getAll({ category: params.slug, sort })
      .then((res) => {
        const fetched = res.data.products || res.data.data || res.data;
        setProducts(Array.isArray(fetched) ? fetched : []);
      })
      .catch((err) => console.error('Category fetch error:', err))
      .finally(() => setLoading(false));
  }, [params.slug, sort]);

  return (
    <div className="bg-gradient-to-b from-emerald-50/30 via-white to-white min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/categories" className="inline-flex items-center gap-2 text-xs font-bold text-brand-textSub hover:text-brand-primary transition-colors">
            <ArrowLeft size={16} /> Back to All Categories
          </Link>
        </div>

        {/* Hero Header */}
        <div className="bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-3xl p-8 shadow-glass mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-extrabold uppercase tracking-widest mb-2">
              <Grid size={13} />
              <span>CATEGORY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-brand-dark">
              {categoryName}
            </h1>
            <p className="text-brand-textSub text-xs sm:text-sm mt-1">
              Explore authentic {categoryName} sourced directly from sustainable Indian spice farms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-brand-textSub">Sort By:</label>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-white border border-brand-border/80 px-4 py-2 rounded-full text-xs font-bold text-brand-dark focus:outline-none focus:border-brand-primary"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-brand-textSub">
            <div className="w-10 h-10 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin mx-auto mb-4"></div>
            <span>Loading {categoryName}...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white/60 rounded-3xl border border-brand-border/60">
            <Search size={36} className="text-brand-primary/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-brand-dark mb-1">No products found in this category</h3>
            <p className="text-xs text-brand-textSub mb-6">Check back soon or browse all spices in our shop.</p>
            <Link href="/products" className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-full shadow-md">
              Browse All Spices
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
