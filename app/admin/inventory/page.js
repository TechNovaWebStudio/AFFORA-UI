'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  XCircle,
  TrendingUp,
  Boxes,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';

export default function AdminInventoryPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Search, Filter, & View States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Local state for stock inputs
  const [stockInputs, setStockInputs] = useState({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getProducts();
      const fetched = res.data?.data || res.data?.products || res.data || [];
      setProducts(fetched);
      
      const initialInputs = {};
      fetched.forEach((p) => {
        initialInputs[p._id] = p.stock ?? 0;
      });
      setStockInputs(initialInputs);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset pagination to page 1 whenever filters or search terms change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, stockStatusFilter, itemsPerPage]);

  const handleInputChange = (productId, value) => {
    setStockInputs((prev) => ({ ...prev, [productId]: value }));
  };

  const handleStockUpdate = async (productId) => {
    const newStock = Number(stockInputs[productId]);
    const currentProduct = products.find((p) => p._id === productId);

    if (isNaN(newStock) || newStock < 0 || currentProduct?.stock === newStock) {
      return;
    }

    setUpdatingId(productId);
    try {
      await adminApi.updateProduct(productId, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, stock: newStock } : p))
      );
      toast.success('Stock updated successfully');
    } catch (err) {
      toast.error('Failed to update stock');
      setStockInputs((prev) => ({
        ...prev,
        [productId]: currentProduct?.stock ?? 0,
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.categoryName || 'Spice'));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Combined Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryName = product.categoryName || 'Spice';
      const matchesCategory =
        selectedCategory === 'All' || categoryName === selectedCategory;

      const threshold = product.lowStockThreshold || 10;
      const isOutOfStock = product.stock <= 0;
      const isLowStock = product.stock > 0 && product.stock <= threshold;
      const isInStock = product.stock > threshold;

      let matchesStatus = true;
      if (stockStatusFilter === 'inStock') matchesStatus = isInStock;
      if (stockStatusFilter === 'lowStock') matchesStatus = isLowStock;
      if (stockStatusFilter === 'outOfStock') matchesStatus = isOutOfStock;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, stockStatusFilter]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Enhanced Summary Statistics Calculations
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(
      (p) => p.stock > (p.lowStockThreshold || 10)
    ).length;
    const low = products.filter(
      (p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)
    ).length;
    const out = products.filter((p) => p.stock <= 0).length;
    const totalUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

    const healthyPct = total ? Math.round((inStock / total) * 100) : 0;
    const lowPct = total ? Math.round((low / total) * 100) : 0;
    const outPct = total ? Math.round((out / total) * 100) : 0;

    return { total, inStock, low, out, totalUnits, healthyPct, lowPct, outPct };
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark flex items-center gap-2">
            <Package className="w-8 h-8 text-brand-primary" />
            Inventory Management
          </h1>
          <p className="text-xs text-brand-textSub mt-1">
            Track real-time stock levels, low-stock warnings, and bulk stock adjustments.
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 border border-brand-border/60 text-brand-dark shadow-sm hover:bg-brand-light transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <div 
          onClick={() => setStockStatusFilter('All')}
          className={`cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/40 backdrop-blur-xl border ${
            stockStatusFilter === 'All' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-brand-border/60'
          } p-5 rounded-3xl shadow-glass transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-textSub uppercase tracking-wider">Total SKUs</span>
            <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100 group-hover:scale-110 transition-transform">
              <Boxes size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-dark tracking-tight">{stats.total}</span>
            <span className="text-xs font-semibold text-brand-textSub">Items</span>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-center justify-between text-[11px] font-bold text-brand-textSub">
            <span>Total Stock Units</span>
            <span className="text-blue-600 font-extrabold flex items-center gap-1">
              <TrendingUp size={12} /> {stats.totalUnits.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Healthy Stock */}
        <div 
          onClick={() => setStockStatusFilter('inStock')}
          className={`cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/40 backdrop-blur-xl border ${
            stockStatusFilter === 'inStock' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-brand-border/60'
          } p-5 rounded-3xl shadow-glass transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">In Stock</span>
            <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-950 tracking-tight">{stats.inStock}</span>
            <span className="text-xs font-semibold text-emerald-700">{stats.healthyPct}% of total</span>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-100/60">
            <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats.healthyPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 3: Low Stock Warnings */}
        <div 
          onClick={() => setStockStatusFilter('lowStock')}
          className={`cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white via-white to-amber-50/40 backdrop-blur-xl border ${
            stockStatusFilter === 'lowStock' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-brand-border/60'
          } p-5 rounded-3xl shadow-glass transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Low Stock</span>
            <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100 group-hover:scale-110 transition-transform">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950 tracking-tight">{stats.low}</span>
            <span className="text-xs font-semibold text-amber-700">{stats.lowPct}% of total</span>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100/60">
            <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats.lowPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div 
          onClick={() => setStockStatusFilter('outOfStock')}
          className={`cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white via-white to-red-50/40 backdrop-blur-xl border ${
            stockStatusFilter === 'outOfStock' ? 'border-red-500 ring-2 ring-red-500/20' : 'border-brand-border/60'
          } p-5 rounded-3xl shadow-glass transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Out of Stock</span>
            <div className="p-2.5 bg-red-50 rounded-2xl text-red-600 border border-red-100 group-hover:scale-110 transition-transform">
              <XCircle size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-950 tracking-tight">{stats.out}</span>
            <span className="text-xs font-semibold text-red-700">{stats.outPct}% of total</span>
          </div>
          <div className="mt-4 pt-3 border-t border-red-100/60">
            <div className="w-full bg-red-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-red-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats.outPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar (Search, Filter, View Toggles) */}
      <div className="bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-2xl p-4 shadow-glass flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-brand-light/30 border border-brand-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary font-medium transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-brand-light/30 border border-brand-border/60 rounded-xl px-3 py-1.5 text-xs font-medium">
            <Filter size={14} className="text-brand-textSub" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-brand-dark cursor-pointer font-bold"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-brand-light/30 border border-brand-border/60 rounded-xl px-3 py-1.5 text-xs font-medium">
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none text-brand-dark cursor-pointer font-bold"
            >
              <option value="All">All Stock Statuses</option>
              <option value="inStock">In Stock</option>
              <option value="lowStock">Low Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center bg-brand-light/50 border border-brand-border/60 p-1 rounded-xl ml-auto md:ml-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'table' ? 'bg-white shadow-sm text-brand-dark font-bold' : 'text-brand-textSub hover:text-brand-dark'
              }`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-brand-dark font-bold' : 'text-brand-textSub hover:text-brand-dark'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content (Table / Grid View) */}
      {loading ? (
        <div className="py-24 text-center text-brand-textSub flex flex-col items-center justify-center gap-3">
          <RefreshCw size={24} className="animate-spin text-brand-primary" />
          <span className="text-xs font-semibold">Loading inventory details...</span>
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className="py-20 text-center bg-white/50 backdrop-blur-xl rounded-3xl border border-brand-border/60 shadow-glass">
          <Package className="w-12 h-12 text-brand-textSub mx-auto mb-3 opacity-40" />
          <p className="text-base font-bold text-brand-dark">No products found</p>
          <p className="text-xs text-brand-textSub mt-1">Try broadening your search or modifying filter criteria.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-brand-border/60 shadow-glass overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-light/50 border-b border-brand-border/60 text-brand-dark uppercase font-extrabold tracking-wider">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Current Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Update Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 font-medium">
              {paginatedProducts.map((product) => {
                const threshold = product.lowStockThreshold || 10;
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= threshold;

                return (
                  <tr key={product._id} className="hover:bg-brand-light/20 transition-colors">
                    <td className="p-4 font-bold text-brand-dark flex items-center gap-3">
                      <img 
                        src={product.images?.[0] || '/Pepper.png'} 
                        alt={product.name} 
                        className="w-9 h-9 rounded-xl object-contain bg-brand-light p-1 border border-brand-border/40" 
                      />
                      <span className="truncate max-w-[200px]">{product.name}</span>
                    </td>
                    <td className="p-4 text-brand-textSub">{product.categoryName || 'Spice'}</td>
                    <td className="p-4 font-mono text-brand-textSub">{product.sku || 'N/A'}</td>
                    <td className="p-4 font-bold text-brand-dark">₹{product.price}</td>
                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} /> Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <AlertTriangle size={12} /> Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <CheckCircle size={12} /> In Stock ({product.stock})
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={stockInputs[product._id] ?? ''}
                          onChange={(e) => handleInputChange(product._id, e.target.value)}
                          onBlur={() => handleStockUpdate(product._id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleStockUpdate(product._id)}
                          className="w-20 border border-brand-border/80 rounded-lg px-2 py-1 text-xs font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
                        />
                        {updatingId === product._id && <RefreshCw size={14} className="animate-spin text-brand-primary" />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => {
            const threshold = product.lowStockThreshold || 10;
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= threshold;

            return (
              <div 
                key={product._id} 
                className="bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-2xl p-4 shadow-glass flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <img 
                      src={product.images?.[0] || '/Pepper.png'} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-xl object-contain bg-brand-light p-1.5 border border-brand-border/40" 
                    />
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-100 text-red-800 flex items-center gap-1">
                        <AlertTriangle size={10} /> Out
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 flex items-center gap-1">
                        <AlertTriangle size={10} /> Low ({product.stock})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle size={10} /> In Stock ({product.stock})
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-brand-dark line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between text-xs text-brand-textSub mt-1">
                    <span>{product.categoryName || 'Spice'}</span>
                    <span className="font-mono">{product.sku || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-border/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-textSub uppercase font-bold block">Price</span>
                    <span className="text-sm font-extrabold text-brand-dark">₹{product.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={stockInputs[product._id] ?? ''}
                      onChange={(e) => handleInputChange(product._id, e.target.value)}
                      onBlur={() => handleStockUpdate(product._id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStockUpdate(product._id)}
                      className="w-16 border border-brand-border/80 rounded-lg px-2 py-1 text-xs font-bold text-center bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary"
                    />
                    {updatingId === product._id && <RefreshCw size={14} className="animate-spin text-brand-primary" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && filteredProducts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-2xl p-4 shadow-glass flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-brand-textSub">
          {/* Item counter */}
          <div>
            Showing <span className="text-brand-dark font-extrabold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-brand-dark font-extrabold">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{' '}
            of <span className="text-brand-dark font-extrabold">{filteredProducts.length}</span> items
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-brand-light/40 border border-brand-border/60 rounded-lg px-2 py-1 text-brand-dark font-bold focus:outline-none cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Page Navigation Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="px-3 py-1 bg-brand-light/50 border border-brand-border/60 rounded-lg font-bold text-brand-dark">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-brand-border/60 hover:bg-brand-light disabled:opacity-40 disabled:hover:bg-transparent transition"
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}