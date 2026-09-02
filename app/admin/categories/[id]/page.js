'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { useToast } from '../../../../context/ToastContext';

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      try {
        const catRes = await adminApi.getCategories();
        const allCategories = catRes.data.data || catRes.data;
        setCategories(allCategories);

        const category = allCategories.find(c => c._id === id);
        if (category) {
          setFormData({
            ...category,
            parentCategory: category.parentCategory || '',
          });
          if (category.image) setImagePreview(category.image);
          if (category.bannerImage) setBannerPreview(category.bannerImage);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

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
      let imageUrl = formData.image || '';
      let bannerUrl = formData.bannerImage || '';

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
        image: !imagePreview ? '' : imageUrl, // handle remove
        bannerImage: !bannerPreview ? '' : bannerUrl,
      };
      
      await adminApi.updateCategory(id, payload);
      toast.success('Category updated successfully');
      router.push('/admin/categories');
    } catch (error) {
      toast.error(error.message || 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]">Loading category...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Link href="/admin/categories" className="inline-flex items-center gap-2 text-brand-textSub hover:text-brand-primary transition-colors">
          <ArrowLeft size={16} /> Back to Categories
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-brand-dark">Edit Category</h1>
        <p className="text-brand-textSub text-sm">Update your product category details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
          <h2 className="text-lg font-bold text-brand-dark mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Category Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Slug (URL friendly)</label>
              <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Parent Category</label>
              <select name="parentCategory" value={formData.parentCategory} onChange={handleChange} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary">
                <option value="">None (Top Level Category)</option>
                {categories.filter(c => c._id !== id).map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-dark mb-1">Short Description</label>
              <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
          <h2 className="text-lg font-bold text-brand-dark mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Category Thumbnail</label>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleImageChange(e, false)} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary mb-3" />
              {imagePreview && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                  <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Category Banner</label>
              <input type="file" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleImageChange(e, true)} className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary mb-3" />
              {bannerPreview && (
                <div className="relative w-full h-32 border rounded-lg overflow-hidden group">
                  <img src={bannerPreview} alt="banner preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setBannerFile(null); setBannerPreview(null); }} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
            <span className="text-sm font-medium text-brand-dark">Active Status</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="rounded border-brand-border text-brand-primary focus:ring-brand-primary" />
            <span className="text-sm font-medium text-brand-dark">Featured Category</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/categories" className="px-6 py-2 border border-brand-border rounded-xl text-brand-dark font-medium hover:bg-brand-light transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50">
            <Save size={18} /> {saving ? 'Saving...' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
