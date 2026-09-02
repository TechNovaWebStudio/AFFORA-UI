'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, CheckCircle2, 
  Percent, IndianRupee, Truck, Sparkles, Layers, Tag, Box, UploadCloud, Eye 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { adminApi } from '../../services/adminApi';

export default function ProductForm({ initialData, onSubmit, saving, isEdit }) {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    sku: '',
    price: '',
    comparePrice: '',
    stock: 100,
    lowStockThreshold: 10,
    category: '',
    categoryName: '',
    weight: '100g',
    brand: '',
    active: true,
    featured: false,
    images: [],
    
    // Offer
    offerEnabled: false,
    offerType: 'percentage', // percentage, fixed
    offerValue: '',
    offerStartDate: '',
    offerEndDate: '',

    // Shipping
    shippingEnabled: true,
    shippingType: 'fixed', // free, fixed, weight
    shippingCharge: '',
    ...initialData // Override with initial data if provided
  });
  console.log('Initial Form Data:', formData.images);

  const [variants, setVariants] = useState(initialData?.variants || []);

  useEffect(() => {
    adminApi.getCategories().then(res => {
      const categoryData = res.data.data || res.data;
      setCategories(categoryData);
      if (!isEdit && categoryData && categoryData.length > 0 && !formData.category) {
        const cat = categoryData[0];
        setFormData(prev => ({ ...prev, category: cat._id, categoryName: cat.name }));
      }
    }).catch(console.error);
    
    if (isEdit && initialData?.images?.length > 0) {
        const existingUrls = initialData.images.map(img => typeof img === 'string' ? img : img.url);
        setImagePreviews(existingUrls);
        
        setImageFiles(initialData.images.map(img => {
          if (typeof img === 'string') {
            return { url: img, isExisting: true };
          }
          return { ...img, isExisting: true };
        }));
    }
  }, [isEdit, initialData]);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isImage) toast.error(`${file.name} is not an image`);
      if (!isLt5M) toast.error(`${file.name} is larger than 5MB`);
      return isImage && isLt5M;
    });

    if (validFiles.length === 0) return;

    const newPreviews = validFiles.map(file => URL.createObjectURL(file));

    // Update both state arrays AND sync into formData.images so it's bound to the object payload
    setImageFiles(prev => {
      const updated = [...prev, ...validFiles];
      setFormData(f => ({ ...f, images: updated }));
      return updated;
    });

    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    e.target.value = '';
  };

  const removeImage = (index) => {
    const targetPreview = imagePreviews[index];
    if (targetPreview && targetPreview.startsWith('blob:')) {
      URL.revokeObjectURL(targetPreview);
    }

    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: updatedFiles }));
  };

  const setPrimaryImage = (index) => {
    if (index === 0) return;
    
    const newFiles = [...imageFiles];
    const itemFile = newFiles.splice(index, 1)[0];
    newFiles.unshift(itemFile);
    setImageFiles(newFiles);
    setFormData(prev => ({ ...prev, images: newFiles }));

    const newPreviews = [...imagePreviews];
    const itemPreview = newPreviews.splice(index, 1)[0];
    newPreviews.unshift(itemPreview);
    setImagePreviews(newPreviews);
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const cat = categories.find(c => c._id === catId);
    setFormData(prev => ({
      ...prev,
      category: catId,
      categoryName: cat ? cat.name : ''
    }));
  };

  const addVariant = () => {
    setVariants([...variants, { weight: '', price: '', stock: 0, sku: '' }]);
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass formData (which now explicitly holds images array), imageFiles, and variants
    onSubmit(formData, imageFiles, variants);
  };

  // Calculations for Live Preview
  const basePrice = Number(formData.price) || 0;
  let finalPrice = basePrice;
  if (formData.offerEnabled && formData.offerValue) {
    if (formData.offerType === 'percentage') {
      finalPrice = basePrice - (basePrice * (Number(formData.offerValue) / 100));
    } else {
      finalPrice = basePrice - Number(formData.offerValue);
    }
  }

  return (
    <div className="max-w-[1500px] mx-auto pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header Actions */}
      <div className="mb-8 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link 
          href="/admin/products" 
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/40 hover:bg-white/80 border border-slate-200/60 shadow-sm text-slate-600 hover:text-slate-900 font-semibold text-xs transition-all duration-200 backdrop-blur-md"
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" /> Back to Products
        </Link>
        <button 
          type="button"
          onClick={handleSubmit} 
          disabled={saving} 
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <Save size={18} /> {saving ? (isEdit ? 'Updating...' : 'Publishing...') : (isEdit ? 'Update Product' : 'Publish Product')}
        </button>
      </div>

      {/* Page Title */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold mb-3">
          <Sparkles size={13} /> Product Management
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{isEdit ? 'Edit Product Details' : 'Create New Masterpiece'}</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Configure product details, custom variants, high-conversion offers, and dynamic store visuals.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Form sections */}
        <form onSubmit={handleSubmit} id="productForm" className="flex-1 space-y-8">
          
          {/* Basic Info */}
          <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 transition-all">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Tag size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Basic Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Product Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium transition-all outline-none" placeholder="e.g. Premium Organic Turmeric" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Slug (URL)</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium transition-all outline-none" placeholder="premium-organic-turmeric" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium transition-all outline-none" placeholder="AFF-TUR-100G" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium transition-all outline-none" placeholder="AFFORA" />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Category</label>
                <select required name="category" value={formData.category} onChange={handleCategoryChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium transition-all outline-none">
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Short Tagline</label>
                <input required type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium transition-all outline-none" placeholder="100% Pure & Organic Sourced Direct from Farms..." />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Detailed Description</label>
                <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-medium transition-all outline-none resize-none" placeholder="Describe the rich details, benefits, and origin of your product..."></textarea>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 transition-all">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <ImageIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Product Media</h2>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50/50 hover:bg-purple-50/20 rounded-2xl p-10 text-center transition-all duration-300 group cursor-pointer">
              <input type="file" id="images" multiple accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="hidden" />
              <label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform duration-300 mb-4 border border-purple-100">
                  <UploadCloud size={30} />
                </div>
                <p className="text-sm font-bold text-slate-800">Drop high-res product photos here</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB per file)</p>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((src, index) => (
                  <div key={index} className={`relative group rounded-2xl overflow-hidden border-2 ${index === 0 ? 'border-emerald-500 shadow-md shadow-emerald-500/10' : 'border-slate-200'} aspect-square bg-slate-100 transition-all`}>
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    {index === 0 && (
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md shadow-lg tracking-wider">Main Banner</div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-200 backdrop-blur-xs p-3">
                      {index !== 0 && (
                        <button type="button" onClick={() => setPrimaryImage(index)} className="w-full text-xs font-bold bg-white/90 hover:bg-white text-slate-900 py-2 rounded-xl shadow transition-colors">Set as Primary</button>
                      )}
                      <button type="button" onClick={() => removeImage(index)} className="w-full text-xs font-bold bg-rose-500/90 hover:bg-rose-600 text-white py-2 rounded-xl shadow transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Offers */}
          <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 transition-all">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <IndianRupee size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Pricing & Promotional Offers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Regular Price (₹)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-900 text-sm font-semibold transition-all outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Compare-at Price (M.R.P ₹)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleChange} className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-900 text-sm font-semibold transition-all outline-none" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-6 transition-all">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="offerEnabled" checked={formData.offerEnabled} onChange={handleChange} className="w-5 h-5 rounded-lg border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" />
                <span className="text-sm font-extrabold text-emerald-900">Enable Special Promotional Offer</span>
              </label>
              
              {formData.offerEnabled && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-emerald-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Discount Type</label>
                    <div className="flex bg-white/80 p-1 rounded-xl border border-emerald-200">
                      <button type="button" onClick={() => setFormData(p => ({...p, offerType: 'percentage'}))} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${formData.offerType === 'percentage' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-emerald-700'}`}>
                        <Percent size={13} /> Percentage
                      </button>
                      <button type="button" onClick={() => setFormData(p => ({...p, offerType: 'fixed'}))} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${formData.offerType === 'fixed' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-emerald-700'}`}>
                        <IndianRupee size={13} /> Fixed Flat
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Discount Value</label>
                    <input type="number" name="offerValue" value={formData.offerValue} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-white border border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 text-sm font-semibold outline-none" placeholder={formData.offerType === 'percentage' ? "e.g. 20 (%)" : "e.g. 50 (₹)"} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Start Date</label>
                    <input type="date" name="offerStartDate" value={formData.offerStartDate} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-white border border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-xs font-semibold outline-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">End Date</label>
                    <input type="date" name="offerEndDate" value={formData.offerEndDate} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-white border border-emerald-200 focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-xs font-semibold outline-none" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inventory & Shipping */}
          <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 transition-all">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Box size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Inventory & Logistics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Stock Available</label>
                <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-sm font-semibold outline-none" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">Low Stock Warning Alert</label>
                <input required type="number" name="lowStockThreshold" value={formData.lowStockThreshold} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-sm font-semibold outline-none" />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-6 transition-all">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="shippingEnabled" checked={formData.shippingEnabled} onChange={handleChange} className="w-5 h-5 rounded-lg border-blue-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
                <span className="text-sm font-extrabold text-blue-900">Requires Physical Shipping & Delivery</span>
              </label>
              
              {formData.shippingEnabled && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-blue-200/60 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-extrabold text-blue-800 uppercase tracking-wider">Shipping Strategy</label>
                    <select name="shippingType" value={formData.shippingType} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-white border border-blue-200 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-xs font-semibold outline-none">
                      <option value="free">Free Shipping Complimentary</option>
                      <option value="fixed">Fixed Flat Delivery Fee</option>
                      <option value="weight">Dynamic Weight-Based Global Rules</option>
                    </select>
                  </div>

                  {formData.shippingType === 'fixed' && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-extrabold text-blue-800 uppercase tracking-wider">Flat Shipping Charge (₹)</label>
                      <input type="number" name="shippingCharge" value={formData.shippingCharge} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-white border border-blue-200 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-sm font-semibold outline-none" placeholder="e.g. 50" />
                    </div>
                  )}

                  {formData.shippingType === 'weight' && (
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-extrabold text-blue-800 uppercase tracking-wider">Item Mass Weight</label>
                      <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full h-11 px-4 rounded-xl bg-white border border-blue-200 focus:ring-4 focus:ring-blue-500/10 text-slate-900 text-sm font-semibold outline-none" placeholder="e.g. 500g" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 transition-all">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Layers size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Custom Variants & Weights</h2>
              </div>
              <button type="button" onClick={addVariant} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors">
                <Plus size={15} /> Add Variant Option
              </button>
            </div>
            
            {variants.length === 0 ? (
              <div className="py-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-400">No variant options attached. Product functions as a standard single item.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variants.map((v, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all">
                    <div className="flex-1 space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Size / Weight</label>
                      <input type="text" value={v.weight} onChange={(e) => updateVariant(index, 'weight', e.target.value)} placeholder="e.g. 250g" className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 text-xs font-medium outline-none" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SKU Code</label>
                      <input type="text" value={v.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="Variant SKU" className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 text-xs font-medium outline-none" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Price (₹)</label>
                      <input type="number" value={v.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} placeholder="Variant Price" className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 text-xs font-medium outline-none" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Stock Units</label>
                      <input type="number" value={v.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} placeholder="Variant Stock" className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 focus:border-indigo-500 text-slate-800 text-xs font-medium outline-none" />
                    </div>
                    <div className="flex items-end justify-end pt-2 md:pt-0">
                      <button type="button" onClick={() => removeVariant(index)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </form>

        {/* Right: Live Preview Panel */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-10 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Eye size={16} className="text-emerald-600" /> Storefront Preview
              </h2>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2.5 py-0.5 rounded-full uppercase">Real-time</span>
            </div>
            
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-200/80 transition-all">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                {imagePreviews.length > 0 ? (
                  <img src={imagePreviews[0]} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                    <ImageIcon size={48} strokeWidth={1.5} />
                    <span className="text-xs font-semibold">Image Preview Container</span>
                  </div>
                )}
                
                {/* Offer Badge Overlay */}
                {formData.offerEnabled && formData.offerValue && (
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-lg shadow-emerald-600/30 backdrop-blur-md">
                    {formData.offerType === 'percentage' ? `${formData.offerValue}% SPECIAL SAVINGS` : `₹${formData.offerValue} OFF`}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">{formData.categoryName || 'Select Category'}</p>
                <h3 className="text-xl font-bold text-slate-900 leading-snug mb-3">
                  {formData.name || 'Product Title Preview'}
                </h3>
                
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="text-2xl font-black text-slate-900">₹{finalPrice > 0 ? finalPrice.toLocaleString() : '0'}</span>
                  {formData.offerEnabled && formData.offerValue && (
                    <span className="text-sm font-semibold text-slate-400 line-through">₹{basePrice.toLocaleString()}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                    {formData.stock > 0 ? `${formData.stock} In Stock` : 'Out of Stock'}
                  </div>
                  {formData.shippingEnabled && (
                    <div className="flex items-center gap-1.5">
                      <Truck size={15} className="text-blue-500" />
                      {formData.shippingType === 'free' ? 'Free Shipping' : 'Paid Shipping'}
                    </div>
                  )}
                </div>
                
                <button disabled className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg opacity-90 cursor-not-allowed">
                  Add to Shopping Cart
                </button>
              </div>
            </div>

            {/* Store Visibility Controls */}
            <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-200/50 p-6">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Publishing Visibility</h4>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" />
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Active on Storefront</span>
                    <span className="text-[11px] text-slate-400 block">Make this item visible to customers</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0" />
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Featured Showcase</span>
                    <span className="text-[11px] text-slate-400 block">Pin to storefront hero sections</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}