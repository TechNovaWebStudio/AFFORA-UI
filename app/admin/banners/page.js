'use client';

import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Pencil, 
  X 
} from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([
    {
      _id: 'b1',
      title: 'The Authentic Taste',
      subtitle: 'Premium Indian spices carefully sourced and delivered globally.',
      imageUrl: '/hero.png',
      linkUrl: '/products',
      active: true,
      displayOrder: 1,
      type: 'Banner',
      position: 'Homepage Top',
    },
    {
      _id: 'b2',
      title: 'Lakadong Turmeric',
      subtitle: 'Pure organic golden turmeric with 8%+ curcumin content.',
      imageUrl: '/turmericPoster.png',
      linkUrl: '/products/lakadong-turmeric',
      active: true,
      displayOrder: 2,
      type: 'Banner',
      position: 'Homepage Top',
    },
    {
      _id: 'b3',
      title: 'Pure & Natural Spices',
      subtitle: 'Handpicked for purity, taste and freshness.',
      imageUrl: '/hero.png',
      linkUrl: '/shop',
      active: true,
      displayOrder: 1,
      type: 'Slider',
      position: 'Homepage Slider',
    },
    {
      _id: 'b4',
      title: 'Healthy Living',
      subtitle: 'Natural spices for a better and healthier you.',
      imageUrl: '/turmericPoster.png',
      linkUrl: '/shop',
      active: true,
      displayOrder: 2,
      type: 'Slider',
      position: 'Homepage Slider',
    },
    {
      _id: 'b5',
      title: 'Flavors of India',
      subtitle: 'Experience the rich and diverse flavors of authentic India.',
      imageUrl: '/hero.png',
      linkUrl: '/shop',
      active: false,
      displayOrder: 3,
      type: 'Slider',
      position: 'Homepage Slider',
    },
    {
      _id: 'b6',
      title: 'Free Shipping Offer',
      subtitle: 'Free shipping on all orders above ₹699.',
      imageUrl: '/turmericPoster.png',
      linkUrl: '/shop',
      active: true,
      displayOrder: 3,
      type: 'Banner',
      position: 'Homepage Bottom',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '/hero.png',
    linkUrl: '/products',
    active: true,
    type: 'Banner',
    position: 'Homepage Top',
  });

  const handleAddBanner = (e) => {
    e.preventDefault();
    setBanners(prev => [
      ...prev, 
      { 
        ...formData, 
        _id: `b-${Date.now()}`, 
        displayOrder: prev.length + 1 
      }
    ]);
    setShowModal(false);
    setFormData({ 
      title: '', 
      subtitle: '', 
      imageUrl: '/hero.png', 
      linkUrl: '/products', 
      active: true,
      type: 'Banner',
      position: 'Homepage Top',
    });
  };

  const handleDelete = (id) => {
    setBanners(prev => prev.filter(b => b._id !== id));
  };

  const toggleActive = (id) => {
    setBanners(prev => prev.map(b => b._id === id ? { ...b, active: !b.active } : b));
  };

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = 
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.linkUrl.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All Status' || 
      (statusFilter === 'Active' && banner.active) || 
      (statusFilter === 'Inactive' && !banner.active);

    const matchesType = 
      typeFilter === 'All Types' || 
      banner.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary border border-brand-border/60 shadow-sm shrink-0">
            <ImageIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-dark">Homepage Banners & Sliders</h1>
            <p className="text-xs text-brand-textSub mt-0.5">Manage luxury promo banners and hero carousel sliders.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-brand-primaryHover transition-all shadow-sm shrink-0"
        >
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* 2. SEARCH + FILTER TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-brand-border/60 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-textSub" />
          <input 
            type="text" 
            placeholder="Search banners..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-light/50 border border-brand-border/60 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-primary transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-brand-light/50 border border-brand-border/60 rounded-xl px-4 py-2.5 pr-9 text-xs font-medium text-brand-dark focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textSub pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-brand-light/50 border border-brand-border/60 rounded-xl px-4 py-2.5 pr-9 text-xs font-medium text-brand-dark focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              <option>All Types</option>
              <option>Banner</option>
              <option>Slider</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-textSub pointer-events-none" />
          </div>

          <button className="px-4 py-2.5 bg-brand-light/50 border border-brand-border/60 text-xs font-medium text-brand-dark rounded-xl flex items-center gap-2 hover:bg-brand-light transition-all">
            <Filter size={14} className="text-brand-textSub" /> Filters
          </button>
        </div>
      </div>

      {/* 3. BANNER TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-brand-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border/60 text-[11px] font-bold text-brand-textSub uppercase tracking-wider bg-brand-light/20">
                <th className="py-3.5 px-4">Banner</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Link</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Position</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-xs">
              {filteredBanners.length > 0 ? (
                filteredBanners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-brand-light/20 transition-colors">
                    {/* 4. BANNER COLUMN */}
                    <td className="py-3 px-4 w-48">
                      <div className="relative w-[140px] h-[60px] sm:w-[180px] sm:h-[72px] rounded-xl overflow-hidden bg-brand-light border border-brand-border/40 shrink-0">
                        <img src={banner.imageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute bottom-1.5 right-1.5 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-brand-dark shadow-sm">
                          <ImageIcon size={12} />
                        </div>
                      </div>
                    </td>

                    {/* 5. TITLE COLUMN */}
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-bold text-brand-dark">{banner.title}</div>
                      <div className="text-brand-textSub text-[11px] line-clamp-2 mt-0.5">{banner.subtitle}</div>
                    </td>

                    {/* 6. TYPE COLUMN */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${banner.type === 'Slider' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {banner.type || 'Banner'}
                      </span>
                    </td>

                    {/* 7. LINK COLUMN */}
                    <td className="py-3 px-4 max-w-[160px]">
                      <span className="text-brand-primary font-medium truncate block">{banner.linkUrl}</span>
                    </td>

                    {/* 8. STATUS COLUMN */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button 
                        onClick={() => toggleActive(banner._id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${banner.active ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {banner.active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>

                    {/* 9. POSITION COLUMN */}
                    <td className="py-3 px-4 whitespace-nowrap text-brand-dark font-medium">
                      {banner.position || 'Homepage Top'}
                    </td>

                    {/* 10. ORDER COLUMN */}
                    <td className="py-3 px-4 whitespace-nowrap text-brand-dark font-medium">
                      {banner.displayOrder}
                    </td>

                    {/* 11. ACTIONS COLUMN */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button className="p-1.5 text-brand-textSub hover:text-brand-primary hover:bg-brand-light rounded-lg transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button 
                          onClick={() => handleDelete(banner._id)} 
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-brand-textSub">
                    No matching banners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 13. TABLE FOOTER / PAGINATION */}
        <div className="py-3 px-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-textSub bg-white">
          <div>
            Showing 1 to {filteredBanners.length} of {banners.length} banners
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <div className="relative">
                <select className="appearance-none bg-brand-light/50 border border-brand-border/65 rounded-lg px-3 py-1 pr-7 text-xs font-medium text-brand-dark focus:outline-none">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-textSub pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 border border-brand-border/60 rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50">
                <ChevronsLeft size={14} />
              </button>
              <button className="p-1.5 border border-brand-border/60 rounded-lg hover:bg-brand-light transition-colors disabled:opacity-50">
                <ChevronLeft size={14} />
              </button>
              <button className="w-7 h-7 bg-brand-primary text-white font-bold rounded-lg flex items-center justify-center shadow-sm">
                1
              </button>
              <button className="p-1.5 border border-brand-border/60 rounded-lg hover:bg-brand-light transition-colors">
                <ChevronRight size={14} />
              </button>
              <button className="p-1.5 border border-brand-border/60 rounded-lg hover:bg-brand-light transition-colors">
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 14. ADD BANNER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-brand-border space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-brand-border/60 pb-3">
              <h3 className="font-display font-bold text-lg text-brand-dark">Create New Banner</h3>
              <button onClick={() => setShowModal(false)} className="text-brand-textSub hover:text-brand-dark">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-brand-dark mb-1">Heading</label>
                <input 
                  required 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="e.g. Summer Special"
                  className="w-full border border-brand-border/60 rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-brand-dark" 
                />
              </div>
              <div>
                <label className="block font-bold text-brand-dark mb-1">Subtitle</label>
                <input 
                  required 
                  type="text" 
                  value={formData.subtitle} 
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} 
                  placeholder="e.g. Discover our latest collection"
                  className="w-full border border-brand-border/60 rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-brand-dark" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-brand-border/60 rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-brand-dark bg-white"
                  >
                    <option value="Banner">Banner</option>
                    <option value="Slider">Slider</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Position</label>
                  <select 
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full border border-brand-border/60 rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-brand-dark bg-white"
                  >
                    <option value="Homepage Top">Homepage Top</option>
                    <option value="Homepage Slider">Homepage Slider</option>
                    <option value="Homepage Bottom">Homepage Bottom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-brand-dark mb-1">Image URL</label>
                <input 
                  required 
                  type="text" 
                  value={formData.imageUrl} 
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
                  className="w-full border border-brand-border/60 rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-brand-dark" 
                />
              </div>
              <div>
                <label className="block font-bold text-brand-dark mb-1">Destination Link</label>
                <input 
                  required 
                  type="text" 
                  value={formData.linkUrl} 
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} 
                  className="w-full border border-brand-border/60 rounded-xl p-2.5 focus:outline-none focus:border-brand-primary text-brand-dark" 
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-brand-border/60 rounded-xl font-medium text-brand-dark hover:bg-brand-light transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primaryHover transition-colors shadow-sm"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}