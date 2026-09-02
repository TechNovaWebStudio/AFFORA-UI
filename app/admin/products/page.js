'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package, 
  Filter, 
  Eye, 
  AlertTriangle, 
  PackageX, 
  CheckCircle2, 
  Boxes,
  X,
  Sparkles,
  Download,
  Star,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const ITEMS_PER_PAGE = viewMode === 'table' ? 7 : 8;

  const { toast } = useToast();
  const { confirm } = usePopup();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getProducts();
      setProducts(res.data.products || res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, stockFilter]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Are you sure you want to delete this product?', { title: 'Delete Product?' });
    if (isConfirmed) {
      try {
        await adminApi.deleteProduct(id);
        setProducts(products.filter(p => p._id !== id));
        setSelectedProductIds(selectedProductIds.filter(itemId => itemId !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category?.name === categoryFilter || p.categoryName === categoryFilter;
    
    const stock = p.stock ?? 0;
    let matchesStock = true;
    if (stockFilter === 'active') matchesStock = p.isActive !== false;
    if (stockFilter === 'low') matchesStock = stock > 0 && stock <= 10;
    if (stockFilter === 'out') matchesStock = stock <= 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => p.isActive !== false).length;
  const lowStockCount = products.filter(p => {
    const stock = p.stock ?? 0;
    return stock > 0 && stock <= 10;
  }).length;
  const outOfStockCount = products.filter(p => (p.stock ?? 0) <= 0).length;

  const activePercentage = totalProductsCount > 0 ? Math.round((activeProductsCount / totalProductsCount) * 100) : 0;
  const lowStockPercentage = totalProductsCount > 0 ? Math.round((lowStockCount / totalProductsCount) * 100) : 0;
  const outOfStockPercentage = totalProductsCount > 0 ? Math.round((outOfStockCount / totalProductsCount) * 100) : 0;

  const categories = ['All', ...new Set(products.map(p => p.category?.name || p.categoryName).filter(Boolean))];

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const showingEndIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(paginatedProducts.map(p => p._id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(itemId => itemId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin mb-4"></div>
        <p className="text-brand-textSub text-xs font-bold tracking-wider uppercase">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-16 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
              <Package size={18} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-brand-dark tracking-tight">Products</h1>
          </div>
          <p className="text-brand-textSub text-xs sm:text-sm mt-1 font-medium">Manage your product listings, inventory, pricing, and status.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="glass-button-primary text-sm px-5 py-2.5 shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setStockFilter('All')}
          className={`glass-card p-4 sm:p-5 flex items-center justify-between border shadow-xs rounded-2xl bg-white/85 backdrop-blur-md relative overflow-hidden cursor-pointer transition-all ${stockFilter === 'All' ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-brand-border/65'}`}
        >
          <div className="space-y-1 z-10">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-brand-textSub">TOTAL PRODUCTS</p>
            <p className="text-2xl font-extrabold text-brand-dark">{totalProductsCount}</p>
            <span className="text-[10px] text-brand-primary font-bold inline-block pt-0.5">↑ 2 new this week</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-inner shrink-0">
            <Boxes size={20} />
          </div>
        </div>

        <div 
          onClick={() => setStockFilter('active')}
          className={`glass-card p-4 sm:p-5 flex items-center justify-between border shadow-xs rounded-2xl bg-white/85 backdrop-blur-md relative overflow-hidden cursor-pointer transition-all ${stockFilter === 'active' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-brand-border/65'}`}
        >
          <div className="space-y-1 z-10">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">ACTIVE PRODUCTS</p>
            <p className="text-2xl font-extrabold text-brand-dark">{activeProductsCount}</p>
            <span className="text-[10px] text-emerald-600 font-bold inline-block pt-0.5">{activePercentage}% of total</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-inner shrink-0">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div 
          onClick={() => setStockFilter('low')}
          className={`glass-card p-4 sm:p-5 flex items-center justify-between border shadow-xs rounded-2xl bg-white/85 backdrop-blur-md relative overflow-hidden cursor-pointer transition-all ${stockFilter === 'low' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-brand-border/65'}`}
        >
          <div className="space-y-1 z-10">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600">LOW STOCK</p>
            <p className="text-2xl font-extrabold text-brand-dark">{lowStockCount}</p>
            <span className="text-[10px] text-amber-600 font-bold inline-block pt-0.5">{lowStockPercentage}% of total</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-inner shrink-0">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div 
          onClick={() => setStockFilter('out')}
          className={`glass-card p-4 sm:p-5 flex items-center justify-between border shadow-xs rounded-2xl bg-white/85 backdrop-blur-md relative overflow-hidden cursor-pointer transition-all ${stockFilter === 'out' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border/65'}`}
        >
          <div className="space-y-1 z-10">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-red-600">OUT OF STOCK</p>
            <p className="text-2xl font-extrabold text-brand-dark">{outOfStockCount}</p>
            <span className="text-[10px] text-red-600 font-bold inline-block pt-0.5">{outOfStockPercentage}% of total</span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 shadow-inner shrink-0">
            <PackageX size={20} />
          </div>
        </div>
      </div>

      {/* Main Products Panel */}
      <div className="glass-card overflow-hidden flex flex-col shadow-xl border border-brand-border/65 rounded-2xl bg-white/95">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-brand-border/40 flex flex-col lg:flex-row gap-3 items-center justify-between bg-white/70 backdrop-blur-md">
          <div className="relative w-full lg:max-w-md group">
            <input 
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass-input pl-10 pr-10 py-2.5 text-xs bg-white/90 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all rounded-xl border-brand-border/60 shadow-inner"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub group-focus-within:text-brand-primary transition-colors" />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textSub hover:text-brand-dark p-1 rounded-full hover:bg-brand-light transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark bg-white px-3 py-2 rounded-xl border border-brand-border/60 shadow-2xs">
              <Filter size={13} className="text-brand-textSub" />
              <span className="text-brand-textSub uppercase text-[9px]">Category:</span>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-brand-dark font-extrabold cursor-pointer text-xs"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => toast.success('Export started')}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-dark bg-white px-3 py-2 rounded-xl border border-brand-border/60 shadow-2xs hover:bg-brand-light transition-colors"
            >
              <Download size={13} className="text-brand-textSub" />
              <span>Export</span>
            </button>

            {/* View Mode Toggle Switcher */}
            <div className="flex items-center bg-brand-light p-0.5 rounded-xl border border-brand-border/60 shadow-2xs">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-white text-brand-primary shadow-xs border border-brand-border/40'
                    : 'text-brand-textSub hover:text-brand-dark'
                }`}
              >
                <TableIcon size={14} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Card Grid View"
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-white text-brand-primary shadow-xs border border-brand-border/40'
                    : 'text-brand-textSub hover:text-brand-dark'
                }`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tags Active Indicator Bar */}
        {(categoryFilter !== 'All' || stockFilter !== 'All' || search) && (
          <div className="px-5 py-2.5 bg-brand-light/40 border-b border-brand-border/30 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-brand-textSub font-bold uppercase text-[10px]">Active Filters:</span>
            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-brand-primary/10 text-brand-primary font-bold px-2.5 py-1 rounded-lg border border-brand-primary/20 text-[11px]">
                Category: {categoryFilter}
                <X size={12} className="cursor-pointer hover:opacity-75" onClick={() => setCategoryFilter('All')} />
              </span>
            )}
            {stockFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 font-bold px-2.5 py-1 rounded-lg border border-amber-500/20 text-[11px]">
                Status: {stockFilter.toUpperCase()}
                <X size={12} className="cursor-pointer hover:opacity-75" onClick={() => setStockFilter('All')} />
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1 bg-gray-500/10 text-gray-700 font-bold px-2.5 py-1 rounded-lg border border-gray-500/20 text-[11px]">
                Search: "{search}"
                <X size={12} className="cursor-pointer hover:opacity-75" onClick={() => setSearch('')} />
              </span>
            )}
            <button 
              onClick={() => { setCategoryFilter('All'); setStockFilter('All'); setSearch(''); }}
              className="text-[11px] font-extrabold text-brand-primary hover:underline ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-brand-textSub">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-brand-light rounded-2xl border border-brand-border/60 flex items-center justify-center mb-3 shadow-inner">
                <Package size={24} className="text-brand-border" />
              </div>
              <p className="font-bold text-brand-dark text-base">No products found</p>
              <p className="text-xs mt-1 text-brand-textSub">Try adjusting your search query or status filter.</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View Mode */
          <div className="w-full overflow-x-auto lg:overflow-x-visible">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-brand-light/50 border-b border-brand-border/40 text-[10px] uppercase font-extrabold text-brand-textSub tracking-wider">
                <tr>
                  <th className="py-3 pl-3 pr-1 w-8 text-center">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProductIds.includes(p._id))}
                      className="rounded border-brand-border text-brand-primary focus:ring-brand-primary/20 cursor-pointer" 
                    />
                  </th>
                  <th className="py-3 px-2">Product</th>
                  <th className="py-3 px-2">SKU</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Stock</th>
                  <th className="py-3 px-2">Rating</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Featured</th>
                  <th className="py-3 px-2">Best Seller</th>
                  <th className="py-3 pl-2 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 bg-white/40">
                {paginatedProducts.map((product) => {
                  const stock = product.stock ?? 0;
                  const isSelected = selectedProductIds.includes(product._id);
                  const isFeatured = product.featured || product.isFeatured || false;
                  const isBestSeller = product.bestSeller || product.isBestSeller || false;
                  
                  return (
                    <tr key={product._id} className={`hover:bg-brand-primary/5 transition-colors ${isSelected ? 'bg-brand-primary/5' : ''}`}>
                      <td className="py-3 pl-3 pr-1 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => handleSelectOne(product._id)}
                          className="rounded border-brand-border text-brand-primary focus:ring-brand-primary/20 cursor-pointer" 
                        />
                      </td>

                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} 
                              alt={product.name} 
                              className="w-10 h-10 rounded-lg object-cover bg-white shadow-2xs border border-brand-border/60 p-0.5 shrink-0" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-brand-light border border-brand-border/60 flex items-center justify-center text-brand-textSub shrink-0 shadow-2xs">
                              <Package size={16} />
                            </div>
                          )}
                          <div className="min-w-0 max-w-[150px] xl:max-w-[190px]">
                            <span className="font-bold text-xs text-brand-dark block truncate hover:text-brand-primary cursor-pointer transition-colors">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-brand-textSub font-medium truncate block">
                              {product.category?.name || product.categoryName || 'Uncategorized'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-2 font-mono text-[10px] font-bold text-brand-dark/70">
                        {product.sku || 'NO-SKU'}
                      </td>

                      <td className="py-3 px-2">
                        <span className="inline-block bg-brand-light border border-brand-border/50 text-brand-primary font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {product.category?.name || product.categoryName || 'Uncategorized'}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <div className="flex flex-col">
                          <span className="font-bold text-brand-dark text-xs">₹{product.salePrice || product.price}</span>
                          {product.salePrice && product.salePrice < product.price && (
                            <span className="text-[9px] line-through text-brand-textSub font-medium">₹{product.price}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                          stock > 10 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          stock > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {stock} in stock
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        {product.rating ? (
                          <div className="flex items-center gap-1 font-bold text-brand-dark text-xs">
                            <Star size={11} className="text-amber-500 fill-amber-500 shrink-0" />
                            <span>{product.rating}</span>
                            {product.numReviews !== undefined && (
                              <span className="text-brand-textSub font-normal text-[10px]">({product.numReviews})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-brand-textSub font-medium">—</span>
                        )}
                      </td>

                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${product.isActive !== false ? 'text-emerald-600' : 'text-brand-textSub'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${product.isActive !== false ? 'bg-emerald-500 shadow-2xs shadow-emerald-500/50' : 'bg-brand-border'}`}></div>
                          {product.isActive !== false ? 'Active' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          isFeatured ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {isFeatured && <Star size={9} className="fill-amber-500 text-amber-500 shrink-0" />}
                          {isFeatured ? 'Yes' : 'No'}
                        </span>
                      </td>

                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          isBestSeller ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>
                          {isBestSeller && <Sparkles size={9} className="text-amber-500 shrink-0" />}
                          {isBestSeller ? 'Yes' : 'No'}
                        </span>
                      </td>

                      <td className="py-3 pl-2 pr-3 text-right">
                        <div className="flex justify-end items-center gap-1">
                          <Link 
                            href={`/admin/products/${product._id}/edit`} 
                            title="Edit Product"
                            className="text-brand-textSub hover:text-brand-primary p-1.5 bg-white hover:bg-brand-light rounded-lg border border-brand-border/60 transition-all shadow-2xs"
                          >
                            <Edit size={13} />
                          </Link>
                          <Link 
                            href={`/admin/products/${product._id}`} 
                            title="View Product Details"
                            className="text-brand-textSub hover:text-brand-primary p-1.5 bg-white hover:bg-brand-light rounded-lg border border-brand-border/60 transition-all shadow-2xs"
                          >
                            <Eye size={13} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product._id)} 
                            title="Delete Product"
                            className="text-brand-textSub hover:text-red-600 p-1.5 bg-white hover:bg-red-50 rounded-lg border border-brand-border/60 hover:border-red-200 transition-all shadow-2xs"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Card Grid View Mode */
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedProducts.map((product) => {
              const stock = product.stock ?? 0;
              const isSelected = selectedProductIds.includes(product._id);
              const isFeatured = product.featured || product.isFeatured || false;
              const isBestSeller = product.bestSeller || product.isBestSeller || false;

              return (
                <div 
                  key={product._id} 
                  className={`glass-card p-4 rounded-2xl border bg-white flex flex-col justify-between transition-all relative ${isSelected ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-brand-primary/5' : 'border-brand-border/65 shadow-xs'}`}
                >
                  <div className="absolute top-3 left-3 z-10">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleSelectOne(product._id)}
                      className="rounded border-brand-border text-brand-primary focus:ring-brand-primary/20 cursor-pointer w-4 h-4 shadow-sm" 
                    />
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${product.isActive !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {product.isActive !== false ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  <div>
                    <div className="w-full h-36 rounded-xl bg-brand-light border border-brand-border/60 mb-3 overflow-hidden flex items-center justify-center relative">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Package size={28} className="text-brand-border" />
                      )}
                    </div>

                    <span className="text-[10px] text-brand-textSub font-bold uppercase tracking-wider block mb-0.5">
                      {product.category?.name || product.categoryName || 'Uncategorized'}
                    </span>
                    <h3 className="font-extrabold text-xs text-brand-dark line-clamp-1 mb-1">{product.name}</h3>
                    <p className="text-[11px] font-mono text-brand-dark/60 mb-3">{product.sku || 'NO-SKU'}</p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-brand-border/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-brand-dark block">₹{product.salePrice || product.price}</span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span className="text-[10px] line-through text-brand-textSub">₹{product.price}</span>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                        stock > 10 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        stock > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {stock} left
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        {isFeatured && <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded">Featured</span>}
                        {isBestSeller && <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded">Best Seller</span>}
                      </div>

                      <div className="flex items-center gap-1">
                        <Link 
                          href={`/admin/products/${product._id}/edit`} 
                          className="p-1.5 bg-white hover:bg-brand-light rounded-lg border border-brand-border/60 text-brand-textSub hover:text-brand-primary shadow-2xs"
                        >
                          <Edit size={13} />
                        </Link>
                        <Link 
                          href={`/admin/products/${product._id}`} 
                          className="p-1.5 bg-white hover:bg-brand-light rounded-lg border border-brand-border/60 text-brand-textSub hover:text-brand-primary shadow-2xs"
                        >
                          <Eye size={13} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="p-1.5 bg-white hover:bg-red-50 rounded-lg border border-brand-border/60 text-brand-textSub hover:text-red-600 shadow-2xs"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer / Pagination Area */}
        <div className="p-4 sm:px-5 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/70 backdrop-blur-md">
          <div className="text-xs text-brand-textSub font-medium">
            Showing {filteredProducts.length > 0 ? startIndex + 1 : 0} – {showingEndIndex} of {filteredProducts.length} products
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-brand-border/60 bg-white text-brand-textSub hover:text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            >
              <ChevronLeft size={15} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-brand-primary text-white shadow-2xs'
                    : 'border border-brand-border/60 bg-white text-brand-textSub hover:text-brand-dark'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-brand-border/60 bg-white text-brand-textSub hover:text-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}