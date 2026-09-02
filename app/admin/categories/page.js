'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Tags, 
  Filter, 
  ArrowLeft, 
  LayoutGrid, 
  EyeOff, 
  Folder, 
  ArrowUp, 
  ArrowDown, 
  ChevronLeft, 
  ChevronRight,
  Circle,
  Table as TableIcon,
  Grid
} from 'lucide-react';
import { adminApi } from '../../../services/adminApi';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const { confirm } = usePopup();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'hidden'
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getCategories();
      setCategories(res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Are you sure you want to delete this category?', { title: 'Delete Category?' });
    if (isConfirmed) {
      try {
        await adminApi.deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c._id !== id));
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Failed to delete category:', error);
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  // Filter categories based on search and status
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) || c.slug?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ? true : statusFilter === 'active' ? c.active : !c.active;
      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  // Pagination calculation
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // Stat calculations
  const totalCategoriesCount = categories.length;
  const activeCategoriesCount = categories.filter((c) => c.active).length;
  const hiddenCategoriesCount = categories.filter((c) => !c.active).length;
  const parentCategoriesCount = categories.filter((c) => !c.parent && !c.parentId).length || categories.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3 font-sans">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-brand-textSub text-sm font-medium">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto font-sans antialiased text-brand-dark">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center text-brand-textSub hover:text-brand-dark hover:bg-brand-light/50 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-brand-light/70 border border-brand-border/60 flex items-center justify-center text-brand-primary">
            <Tags size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-dark">Categories</h1>
            <p className="text-brand-textSub text-sm mt-0.5">
              Manage your product categories, status visibility, and organization.
            </p>
          </div>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus size={18} />
          Add Category
        </Link>
      </div>

      {/* 2. SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-brand-textSub uppercase block mb-1">TOTAL CATEGORIES</span>
            <div className="text-3xl font-bold text-brand-dark mb-1">{totalCategoriesCount}</div>
            <span className="text-xs text-brand-textSub">All categories</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-light/80 border border-brand-border/60 flex items-center justify-center text-brand-primary">
            <LayoutGrid size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-brand-textSub uppercase block mb-1">ACTIVE CATEGORIES</span>
            <div className="text-3xl font-bold text-brand-dark mb-1">{activeCategoriesCount}</div>
            <span className="text-xs text-brand-textSub">Visible on store</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Circle size={18} className="fill-emerald-500 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-brand-textSub uppercase block mb-1">HIDDEN CATEGORIES</span>
            <div className="text-3xl font-bold text-brand-dark mb-1">{hiddenCategoriesCount}</div>
            <span className="text-xs text-brand-textSub">Not visible on store</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <EyeOff size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-brand-textSub uppercase block mb-1">PARENT CATEGORIES</span>
            <div className="text-3xl font-bold text-brand-dark mb-1">{parentCategoriesCount}</div>
            <span className="text-xs text-brand-textSub">Top level categories</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Folder size={20} />
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTAINER */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
        {/* 4. SEARCH + FILTER TOOLBAR & VIEW TOGGLE */}
        <div className="p-4 sm:p-5 border-b border-brand-border">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 md:max-w-[42%]">
              <input
                type="text"
                placeholder="Search by category name or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-brand-light/30 border border-brand-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-brand-textSub/60"
              />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-textSub" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Tags */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-textSub uppercase tracking-wider flex items-center gap-1.5 mr-1">
                  <Filter size={14} /> FILTER:
                </span>
                
                {[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'hidden', label: 'Hidden' },
                ].map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => setStatusFilter(tag.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      statusFilter === tag.id
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'bg-brand-light/60 text-brand-textSub hover:bg-brand-light hover:text-brand-dark'
                    }`}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {/* View Mode Switcher (Table vs Grid Cards) */}
              <div className="flex items-center bg-brand-light/60 border border-brand-border rounded-xl p-1 gap-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'table'
                      ? 'bg-white text-brand-dark shadow-xs'
                      : 'text-brand-textSub hover:text-brand-dark'
                  }`}
                  title="Table View"
                >
                  <TableIcon size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-brand-dark shadow-xs'
                      : 'text-brand-textSub hover:text-brand-dark'
                  }`}
                  title="Card Grid View"
                >
                  <Grid size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. VIEW MODES: TABLE OR CARD GRID */}
        {paginatedCategories.length === 0 ? (
          <div className="px-6 py-16 text-center text-brand-textSub">
            <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
              <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center mb-3">
                <Tags size={24} className="text-brand-textSub" />
              </div>
              <p className="text-sm font-semibold text-brand-dark">No categories found</p>
              <p className="text-xs text-brand-textSub mt-1">Try adjusting your search criteria or status filters.</p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light/40 border-b border-brand-border">
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-textSub uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-textSub uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-textSub uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-textSub uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-textSub uppercase tracking-wider">Display Order</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-brand-textSub uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {paginatedCategories.map((category, index) => {
                  const displayIndex = (currentPage - 1) * pageSize + index + 1;
                  const productCount = category.productCount ?? category.productsCount ?? category.products?.length ?? 0;
                  const displayOrder = category.displayOrder ?? category.order ?? category.sortOrder ?? displayIndex;
                  const categoryImage = category.image || category.imageUrl || category.img;

                  return (
                    <tr key={category._id || index} className="hover:bg-brand-light/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          {categoryImage ? (
                            <img
                              src={categoryImage}
                              alt={category.name}
                              className="w-[80px] h-[54px] rounded-xl object-cover bg-brand-light border border-brand-border flex-shrink-0"
                            />
                          ) : (
                            <div className="w-[80px] h-[54px] rounded-xl bg-brand-light border border-brand-border flex items-center justify-center text-brand-textSub flex-shrink-0">
                              <Tags size={22} />
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-sm text-brand-dark block">{category.name}</span>
                            <span className="text-xs text-brand-textSub mt-0.5 block">{category.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-brand-textSub line-clamp-2">
                          {category.description || '—'}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                            category.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${category.active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {category.active ? 'Active' : 'Hidden'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-brand-dark">{productCount}</div>
                        <div className="text-xs text-brand-textSub">Products</div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center border border-brand-border rounded-lg bg-white overflow-hidden shadow-xs">
                          <button type="button" disabled className="p-1.5 text-brand-textSub hover:bg-brand-light/50 transition-colors disabled:opacity-40" title="Move Up">
                            <ArrowUp size={14} />
                          </button>
                          <span className="px-3 text-xs font-semibold text-brand-dark min-w-[28px] text-center">
                            {displayOrder}
                          </span>
                          <button type="button" disabled className="p-1.5 text-brand-textSub hover:bg-brand-light/50 transition-colors disabled:opacity-40" title="Move Down">
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/categories/${category._id}`}
                            className="p-2 border border-brand-border/60 bg-white text-brand-textSub hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-light/30 rounded-lg transition-all shadow-xs"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="p-2 border border-brand-border/60 bg-white text-brand-textSub hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 rounded-lg transition-all shadow-xs"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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
          /* CARD GRID VIEW */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedCategories.map((category, index) => {
              const displayIndex = (currentPage - 1) * pageSize + index + 1;
              const productCount = category.productCount ?? category.productsCount ?? category.products?.length ?? 0;
              const displayOrder = category.displayOrder ?? category.order ?? category.sortOrder ?? displayIndex;
              const categoryImage = category.image || category.imageUrl || category.img;

              return (
                <div key={category._id || index} className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-brand-primary/40 transition-all">
                  <div>
                    {/* Top Row: Image & Status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      {categoryImage ? (
                        <img
                          src={categoryImage}
                          alt={category.name}
                          className="w-full h-36 rounded-xl object-cover bg-brand-light border border-brand-border"
                        />
                      ) : (
                        <div className="w-full h-36 rounded-xl bg-brand-light border border-brand-border flex items-center justify-center text-brand-textSub">
                          <Tags size={32} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-base text-brand-dark line-clamp-1">{category.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border flex-shrink-0 ${
                          category.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${category.active ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {category.active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    <span className="text-xs text-brand-textSub block mb-2">{category.slug}</span>
                    <p className="text-xs text-brand-textSub line-clamp-2 mb-4">
                      {category.description || '—'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pt-3 border-t border-brand-border text-xs mb-4">
                      <div>
                        <span className="font-semibold text-brand-dark">{productCount}</span> <span className="text-brand-textSub">Products</span>
                      </div>
                      <div>
                        <span className="text-brand-textSub">Order:</span> <span className="font-semibold text-brand-dark">{displayOrder}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${category._id}`}
                        className="flex-1 py-2 border border-brand-border/60 bg-white text-brand-textSub hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-light/30 rounded-xl transition-all shadow-xs text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Edit size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="py-2 px-3 border border-brand-border/60 bg-white text-brand-textSub hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 rounded-xl transition-all shadow-xs"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 14. TABLE FOOTER / PAGINATION */}
        <div className="px-6 py-4 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-light/10">
          <div className="text-xs text-brand-textSub">
            {totalItems > 0 ? (
              <>Showing <span className="font-semibold text-brand-dark">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-semibold text-brand-dark">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-semibold text-brand-dark">{totalItems}</span> categories</>
            ) : (
              <>Showing 0 categories</>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-brand-border rounded-lg bg-white text-brand-textSub hover:bg-brand-light hover:text-brand-dark disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-brand-textSub transition-all shadow-xs"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="px-3.5 py-1.5 border border-brand-border rounded-lg bg-brand-primary text-white text-xs font-semibold shadow-xs"
            >
              {currentPage}
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 border border-brand-border rounded-lg bg-white text-brand-textSub hover:bg-brand-light hover:text-brand-dark disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-brand-textSub transition-all shadow-xs"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}