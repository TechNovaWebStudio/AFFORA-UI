'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Info, Image as ImageIcon, Settings, Eye, Upload, X, FolderTree } from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { useToast } from '../../../../context/ToastContext';

export default function AdminNewCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    parentCategory: '',
    displayOrder: 0,
    featured: false,
    active: true,
  });

  useEffect(() => {
    adminApi.getCategories().then(res => {
      setCategories(res.data.data || res.data);
    }).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e, isBanner = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    
    if (!isImage) {
      toast.error(`${file.name} is not an image`);
      return;
    }
    if (!isLt5M) {
      toast.error(`${file.name} is larger than 5MB`);
      return;
    }

    if (isBanner) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    } else {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = '';
      let bannerUrl = '';

      if (imageFile || bannerFile) {
        const uploadData = new FormData();
        if (imageFile) uploadData.append('images', imageFile);
        if (bannerFile) uploadData.append('images', bannerFile);
        
        const uploadRes = await adminApi.uploadImages(uploadData);
        if (uploadRes.data) {
          const urls = uploadRes.data.map(img => img.url);
          if (imageFile && bannerFile) {
            imageUrl = urls[0];
            bannerUrl = urls[1];
          } else if (imageFile) {
            imageUrl = urls[0];
          } else if (bannerFile) {
            bannerUrl = urls[0];
          }
        }
      }

      const payload = {
        ...formData,
        displayOrder: Number(formData.displayOrder),
        parentCategory: formData.parentCategory || null,
      };

      if (imageUrl) payload.image = imageUrl;
      if (bannerUrl) payload.bannerImage = bannerUrl;
      
      await adminApi.createCategory(payload);
      toast.success('Category created successfully');
      router.push('/admin/categories');
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full pb-12">
      <div className="mb-6">
        <Link href="/admin/categories" className="inline-flex items-center gap-2 text-brand-textSub hover:text-brand-primary transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Categories
        </Link>
      </div>

      <div className="mb-8 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary shrink-0">
          <FolderTree size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-brand-dark">Add New Category</h1>
          <p className="text-brand-textSub text-sm mt-0.5">Create a new product category or subcategory to organize your products.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFORMATION CARD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border/50">
            <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">1</div>
            <div className="flex items-center gap-2 text-brand-dark font-bold text-base">
              <Info size={18} className="text-brand-primary" />
              <h2>Basic Information</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Category Name <span className="text-red-500">*</span></label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter category name" className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors" />
              <p className="text-xs text-brand-textSub mt-1.5">Choose a clear and descriptive name for the category</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Slug (URL friendly, optional)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="Auto-generate if empty" className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors" />
              <p className="text-xs text-brand-textSub mt-1.5">URL-friendly version of the category name</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Parent Category</label>
              <select name="parentCategory" value={formData.parentCategory} onChange={handleChange} className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary bg-white transition-colors">
                <option value="">None (Top Level Category)</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
              <p className="text-xs text-brand-textSub mt-1.5">Select parent category if this is a subcategory</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors" />
              <p className="text-xs text-brand-textSub mt-1.5">Lower numbers appear first in the listing</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Short Description</label>
              <textarea rows={3} name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Enter short description..." className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-primary transition-colors resize-y" />
              <p className="text-xs text-brand-textSub mt-1.5">This description will be shown in category listings</p>
            </div>
          </div>
        </div>

        {/* IMAGES CARD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border/50">
            <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">2</div>
            <div className="flex items-center gap-2 text-brand-dark font-bold text-base">
              <ImageIcon size={18} className="text-brand-primary" />
              <h2>Images</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Category Thumbnail</label>
              <div className="relative border-2 border-dashed border-brand-border rounded-2xl p-6 text-center hover:border-brand-primary transition-colors bg-brand-light/20 flex flex-col items-center justify-center min-h-[160px]">
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleImageChange(e, false)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                {imagePreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden group">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={(e) => { e.preventDefault(); setImageFile(null); setImagePreview(null); }} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="pointer-events-none flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-primary mb-2">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-brand-dark">Drag & drop or <span className="text-brand-primary">choose file</span></p>
                    <p className="text-xs text-brand-textSub mt-1">JPG, PNG or WEBP (Max. 2MB)</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-brand-textSub mt-2">This image will be shown in category list</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-2">Category Banner (Optional)</label>
              <div className="relative border-2 border-dashed border-brand-border rounded-2xl p-6 text-center hover:border-brand-primary transition-colors bg-brand-light/20 flex flex-col items-center justify-center min-h-[160px]">
                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleImageChange(e, true)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                {bannerPreview ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden group">
                    <img src={bannerPreview} alt="banner preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={(e) => { e.preventDefault(); setBannerFile(null); setBannerPreview(null); }} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="pointer-events-none flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-primary mb-2">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-brand-dark">Drag & drop or <span className="text-brand-primary">choose file</span></p>
                    <p className="text-xs text-brand-textSub mt-1">JPG, PNG or WEBP (Max. 5MB)</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-brand-textSub mt-2">Wide banner image for category page</p>
            </div>
          </div>
        </div>

        {/* SETTINGS CARD */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-brand-border/50">
            <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold">3</div>
            <div className="flex items-center gap-2 text-brand-dark font-bold text-base">
              <Settings size={18} className="text-brand-primary" />
              <h2>Settings</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-brand-border cursor-pointer hover:border-brand-primary transition-colors bg-brand-light/10">
              <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="mt-1 rounded border-brand-border text-brand-primary focus:ring-brand-primary w-4 h-4" />
              <div>
                <span className="block text-sm font-bold text-brand-dark">Active Status</span>
                <span className="block text-xs text-brand-textSub mt-0.5">Display this category on the store</span>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 rounded-2xl border border-brand-border cursor-pointer hover:border-brand-primary transition-colors bg-brand-light/10">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="mt-1 rounded border-brand-border text-brand-primary focus:ring-brand-primary w-4 h-4" />
              <div>
                <span className="block text-sm font-bold text-brand-dark">Featured Category</span>
                <span className="block text-xs text-brand-textSub mt-0.5">Show this category in featured sections</span>
              </div>
            </label>
          </div>

          {/* PREVIEW SECTION */}
          <div className="pt-6 border-t border-brand-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-brand-dark font-bold text-sm">
                <Eye size={16} className="text-brand-primary" />
                <span>Preview</span>
              </div>
              <span className="text-xs bg-brand-light text-brand-primary px-2.5 py-1 rounded-full font-medium">Preview Only</span>
            </div>
            <p className="text-xs text-brand-textSub mb-4">This is how your category might look in the store.</p>
            
            <div className="border border-brand-border rounded-2xl p-4 bg-brand-light/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-xl bg-brand-light border border-brand-border flex items-center justify-center text-brand-textSub shrink-0 overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-brand-dark text-base truncate">{formData.name || "Category Name"}</h4>
                <p className="text-xs text-brand-textSub mt-1 line-clamp-2">{formData.shortDescription || "Short description will appear here..."}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${formData.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {formData.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="text-xs text-brand-textSub self-end sm:self-center shrink-0 font-medium">
                Display Order: {formData.displayOrder}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION CARD */}
        <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-sm flex items-center justify-end gap-4">
          <Link href="/admin/categories" className="px-6 py-2.5 border border-brand-border rounded-xl text-brand-dark text-sm font-medium hover:bg-brand-light transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 shadow-sm">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
}