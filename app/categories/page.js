'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productApi } from '../../services/productApi';
import { Grid, ArrowRight } from 'lucide-react';

const defaultCategories = [
  { name: 'Cloves', slug: 'cloves', shortDescription: 'Plump Kerala whole cloves rich in essential oils.', image: '/Cloves.PNG' },
  { name: 'Black Pepper', slug: 'black-pepper', shortDescription: 'Tellicherry bold peppercorns from Malabar coast.', image: '/Pepper.png' },
  { name: 'Cardamom', slug: 'cardamom', shortDescription: 'Jumbo 8mm green cardamom pods full of aroma.', image: '/Cardamom.png' },
  { name: 'Dry Ginger', slug: 'dry-ginger', shortDescription: 'Sun-dried ginger pieces with authentic warm spice notes.', image: '/Pepper.png' },
  { name: 'Turmeric', slug: 'turmeric', shortDescription: 'Lakadong high-curcumin turmeric powder from Meghalaya.', image: '/Turmeric.png' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getCategories()
      .then((res) => {
        const fetched = res.data.data || res.data;
        if (fetched && fetched.length > 0) {
          setCategories(fetched);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-brand-primary font-bold text-xs uppercase tracking-widest mb-3">
            <Grid size={14} />
            <span>INDIAN SPICE CATEGORIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-brand-dark mb-4">
            Explore Our Spice Collections
          </h1>
          <p className="text-brand-textSub text-sm sm:text-base leading-relaxed">
            Sourced directly from certified growing belts across India. Select a category below to discover premium whole & ground spices.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div 
              key={cat._id || idx}
              className="group relative flex flex-col bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-lg hover:border-brand-primary/40 transition-all duration-300 transform hover:-translate-y-1.5"
            >
              {/* Category Image Box */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-light/60 to-white overflow-hidden p-6 flex items-center justify-center">
                <img 
                  src={cat.image || '/hero.png'} 
                  alt={cat.name} 
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
                />
                <span className="absolute top-4 right-4 bg-brand-primary text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  AFFORA Pure
                </span>
              </div>

              {/* Category Info */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-display font-bold text-2xl text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-brand-textSub text-xs leading-relaxed mb-6 flex-grow">
                  {cat.shortDescription || cat.fullDescription || 'Authentic single-origin Indian spices packaged to retain natural aroma and oil content.'}
                </p>

                <Link 
                  href={`/categories/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="w-full py-3 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white font-bold text-xs rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-sm"
                >
                  <span>Explore {cat.name}</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
