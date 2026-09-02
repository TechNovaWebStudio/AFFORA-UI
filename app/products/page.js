'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import { Filter, Search, X, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles, Check, RefreshCw, ShieldCheck, Award, PackageCheck, Globe } from 'lucide-react';
import { productApi } from '../../services/productApi';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Filter States initialized from URL
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '1000');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [stock, setStock] = useState(searchParams.get('stock') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');
  
  // Brand selection state
  const [selectedBrands, setSelectedBrands] = useState(searchParams.get('brands') ? searchParams.get('brands').split(',') : []);

  const [searchInput, setSearchInput] = useState(search || '');
  const searchTimeoutRef = useRef(null);

  const availableBrands = ['Affora', 'Affora Organic', 'Affora Premium'];

  useEffect(() => {
    productApi.getCategories().then(res => {
      setCategories(res.data.data || res.data);
    }).catch(console.error);
  }, []);

  const handleFilterChange = (setter, value) => {
    setCurrentPage(1);
    setter(value);
  };

  const handleBrandToggle = (brandName) => {
    setCurrentPage(1);
    setSelectedBrands(prev => {
      const exists = prev.includes(brandName);
      if (exists) {
        return prev.filter(b => b !== brandName);
      } else {
        return [...prev, brandName];
      }
    });
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        category,
        search,
        minPrice,
        maxPrice,
        minRating,
        stock,
        sort,
        brands: selectedBrands.join(','),
        page: currentPage,
        limit: itemsPerPage,
      };

      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      router.push(`/products?${queryParams.toString()}`, { scroll: false });

      const res = await productApi.getAll(params);
      const productList = res.data.products || res.data.data || (Array.isArray(res.data) ? res.data : []);
      const total = res.data.totalPages || res.data.pages || Math.ceil((res.data.total || productList.length) / itemsPerPage);

      setProducts(productList);
      setTotalPages(total || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [category, search, minPrice, maxPrice, minRating, stock, sort, selectedBrands, currentPage, router]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      handleFilterChange(setSearch, e.target.value);
    }, 500);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setCategory('');
    setSearch('');
    setSearchInput('');
    setMinPrice('');
    setMaxPrice('1000');
    setMinRating('');
    setStock('');
    setSort('recommended');
    setSelectedBrands([]);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeFiltersCount = [category, search, minPrice, maxPrice !== '1000' && maxPrice, minRating, stock, selectedBrands.length > 0 && selectedBrands].filter(Boolean).length;

  return (
    <div className="bg-brand-bg min-h-screen pb-24 pt-6">

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Mini Section / Heading Banner with Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-border/40 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Pure & Authentic
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-dark tracking-tight">
              Our Products
            </h1>
            <p className="text-brand-textSub text-xs sm:text-sm mt-1 max-w-xl">
              Explore our handpicked collection of farm-fresh Indian spices, aromatic blends, and natural herbs.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-80 relative flex-shrink-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-brand-textSub">
              <Search size={16} />
            </span>
            <input 
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search spices, herbs, blends..."
              className="w-full bg-white border border-brand-border pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium text-brand-dark placeholder-brand-textSub/60 focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-sm transition-all"
            />
            {searchInput && (
              <button 
                onClick={() => {
                  setSearchInput('');
                  handleFilterChange(setSearch, '');
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-textSub hover:text-brand-dark"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Results Info & Controls Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 pb-4">
          <div className="text-xs sm:text-sm font-medium text-brand-textSub">
            Showing <span className="text-brand-dark font-bold">{products.length}</span> of products
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Mobile Filter Trigger */}
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-white border border-brand-border px-4 py-2 rounded-xl text-xs font-semibold text-brand-dark shadow-sm"
            >
              <SlidersHorizontal size={14} /> Filters
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 bg-brand-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sort}
                onChange={(e) => handleFilterChange(setSort, e.target.value)}
                className="appearance-none bg-white border border-brand-border pl-4 pr-9 py-2 rounded-xl text-xs font-semibold text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary shadow-sm cursor-pointer"
              >
                <option value="recommended">Sort by: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-8">

          {/* Mobile Overlay Background */}
          <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
              mobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* SIDEBAR FILTER PANEL */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white p-6 shadow-2xl flex flex-col transition-transform duration-300 ease-out
            lg:sticky lg:top-24 lg:z-auto lg:w-72 lg:flex-shrink-0 lg:rounded-2xl lg:border lg:border-brand-border lg:shadow-sm lg:translate-x-0 lg:max-h-[calc(100vh-7rem)]
            ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="space-y-6 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {/* Sidebar Top Header */}
              <div className="flex justify-between items-center pb-3 border-b border-brand-border/40">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-brand-dark">Filters</span>
                </div>
                <button 
                  onClick={clearFilters}
                  className="text-xs font-medium text-brand-primary hover:underline"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="lg:hidden p-1 rounded-full text-brand-textSub hover:text-brand-dark"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Categories Section Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">Categories</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {categories.map(cat => (
                    <label key={cat._id} className="flex items-center justify-between text-xs font-medium text-brand-textSub hover:text-brand-dark cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={category === cat.slug}
                          onChange={() => handleFilterChange(setCategory, category === cat.slug ? '' : cat.slug)}
                          className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-4 h-4"
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-brand-textSub/60 text-[10px]">({cat.count || 0})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 pt-3 border-t border-brand-border/40">
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Price Range</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  value={maxPrice || 1000} 
                  onChange={(e) => handleFilterChange(setMaxPrice, e.target.value)}
                  className="w-full accent-brand-primary bg-brand-light h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-xs text-brand-textSub font-medium">
                  <span>₹0</span>
                  <span>₹{maxPrice || 1000}+</span>
                </div>
              </div>

              {/* Brand Filter Checklist */}
              <div className="space-y-3 pt-3 border-t border-brand-border/40">
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Brand</span>
                <div className="space-y-2">
                  {availableBrands.map((brandName) => {
                    const isChecked = selectedBrands.includes(brandName);
                    return (
                      <label key={brandName} className="flex items-center justify-between text-xs font-medium text-brand-textSub hover:text-brand-dark cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handleBrandToggle(brandName)}
                            className="rounded border-brand-border text-brand-primary focus:ring-brand-primary w-4 h-4"
                          />
                          <span>{brandName}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Ratings Filter */}
              <div className="space-y-3 pt-3 border-t border-brand-border/40">
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider block">Ratings</span>
                <div className="space-y-2">
                  {[4, 3, 2].map(rating => {
                    const active = minRating === String(rating);
                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleFilterChange(setMinRating, active ? '' : String(rating))}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-start gap-2 transition-all ${
                          active
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-white border-brand-border text-brand-textSub hover:bg-brand-light hover:text-brand-dark'
                        }`}
                      >
                        <span className="text-yellow-400">{'★'.repeat(rating)}</span> & above
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Sidebar Apply Filter Button */}
            <div className="pt-4 mt-4 border-t border-brand-border/40 flex-shrink-0">
              <button 
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 px-4 bg-brand-primary text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-brand-primary/90 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Product Grid Area (Fixed 3 items per row, no card borders/backgrounds/shadows) */}
          <main className="flex-grow w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-8 h-8 border-3 border-brand-border border-t-brand-primary rounded-full animate-spin mb-3"></div>
                <p className="text-brand-textSub text-xs">Loading authentic spice collection...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white rounded-2xl border border-brand-border p-8 shadow-sm">
                <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mb-4">
                  <Search size={24} className="text-brand-primary/50" />
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-1">No products found</h3>
                <p className="text-brand-textSub mb-6 text-xs max-w-sm">We couldn't find items matching your criteria. Try relaxing your filters.</p>
                <button 
                  onClick={clearFilters}
                  className="px-5 py-2 bg-brand-primary text-white rounded-full text-xs font-semibold hover:bg-brand-primary/90 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                  {products.map(product => (
                    <div 
                      key={product._id} 
                      className="w-full border-0 bg-transparent shadow-none"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-10 pt-6 border-t border-brand-border/40">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-brand-border bg-white text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-light"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first, last, current, and surrounding pages to prevent overflow
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                              currentPage === page
                                ? 'bg-brand-primary text-white shadow-sm'
                                : 'bg-white border border-brand-border text-brand-dark hover:bg-brand-light'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-1 text-brand-textSub">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-brand-border bg-white text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-light"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* BOTTOM SECTION 1: Features / Benefits Bar */}
      <div className="mt-20 border-y border-brand-border/40 bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-light/50 border border-brand-border/30">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-0.5">100% Pure & Natural</h4>
              <p className="text-[11px] text-brand-textSub">No additives or preservatives added.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-light/50 border border-brand-border/30">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-0.5">Lab Tested for Quality</h4>
              <p className="text-[11px] text-brand-textSub">Every batch tested for supreme purity.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-light/50 border border-brand-border/30">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
              <PackageCheck size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-0.5">Airtight Packaging</h4>
              <p className="text-[11px] text-brand-textSub">Locks in freshness and rich aroma.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-light/50 border border-brand-border/30">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
              <Globe size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-0.5">Worldwide Shipping</h4>
              <p className="text-[11px] text-brand-textSub">Delivering authentic spices globally.</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION 2: Newsletter Subscription Banner */}
      <div className="mt-8 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Sparkles size={240} className="text-white" />
          </div>
          
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 tracking-tight">
              Stay Updated with Affora
            </h3>
            <p className="text-brand-textSub text-xs sm:text-sm">
              Subscribe to get special offers, new arrivals and spice inspiration straight to your inbox.
            </p>
          </div>

          <div className="relative z-10 w-full lg:w-auto flex flex-col sm:flex-row gap-3 max-w-md">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white/10 border border-white/20 px-4 py-3 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-primary flex-grow"
            />
            <button className="bg-brand-primary text-white font-semibold text-xs px-6 py-3 rounded-xl hover:bg-brand-primary/90 transition-all shadow-md whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-brand-textSub text-xs">Loading page content...</div>}>
      <ProductsPageContent />
    </React.Suspense>
  );
}