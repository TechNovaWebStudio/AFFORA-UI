'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Edit, Trash2, Tag, Box, IndianRupee, Layers, CheckCircle2, Image as ImageIcon,
  ChevronLeft, ChevronRight, Maximize2, Flame, Star, MapPin, Scale, Package, Info, ChevronDown
} from 'lucide-react';
import { adminApi } from '../../../../services/adminApi';
import { useToast } from '../../../../context/ToastContext';
import { usePopup } from '../../../../context/PopupContext';

export default function AdminViewProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const { confirm } = usePopup();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const prodRes = await adminApi.getProducts();
        const allProducts = prodRes.data.products || prodRes.data.data || prodRes.data;
        const found = allProducts.find((p) => p._id === id);
        setProduct(found);
      } catch (error) {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id, toast]);

  const handleDelete = async () => {
    const isConfirmed = await confirm('Are you sure you want to delete this product?', { title: 'Delete Product?' });
    if (!isConfirmed) return;

    try {
      await adminApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-slate-500 text-sm font-bold">Product not found</p>
        <Link href="/admin/products" className="mt-4 text-emerald-600 hover:underline">Back to Products</Link>
      </div>
    );
  }

  const categoryName = product.categoryName || product.category?.name || 'Uncategorized';
  const images = product.images || [];

  // Calculations for pricing
  const price = product.price || 0;
  const comparePrice = product.comparePrice || 0;
  const saving = comparePrice > price ? comparePrice - price : 0;
  const discountPercentage = comparePrice > 0 ? Math.round((saving / comparePrice) * 100) : 0;

  return (
    <div className="max-w-[1280px] mx-auto pb-16 px-4 sm:px-6 lg:px-8 pt-4">
      {/* 1. HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/products" 
            className="group inline-flex items-center justify-center p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-slate-600 hover:text-slate-900 transition-all duration-200"
            title="Back to Products"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products List</h1>
            <p className="text-xs text-slate-500 mt-0.5">View and manage product details, inventory, pricing and more.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link 
            href={`/admin/products/edit/${product._id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-emerald-50/50 border border-emerald-600/30 text-emerald-700 font-semibold text-xs shadow-sm transition-all"
          >
            <Edit size={15} className="text-emerald-600" /> Edit Product
          </Link>
          
          <div className="relative inline-block text-left">
            <button 
              type="button"
              onClick={() => {
                // Dropdown or action toggle if needed, keeping functionality intact
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <span>More Actions</span>
              <ChevronDown size={14} />
            </button>
          </div>

          <button 
            onClick={handleDelete}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 transition-all"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* 2. MAIN PRODUCT CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 relative group">
            {images.length > 0 ? (
              <img src={images[activeImage]?.url || images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <ImageIcon size={48} strokeWidth={1.5} />
                <span className="text-xs font-semibold">No Image Available</span>
              </div>
            )}
            
            <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-1.5 rounded-lg border border-slate-200/60 shadow-sm text-slate-700 cursor-pointer hover:bg-white transition-all">
              <Maximize2 size={15} />
            </div>

            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md border border-slate-200 text-slate-700 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-md border border-slate-200 text-slate-700 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-emerald-600 shadow-sm ring-2 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <img src={img.url || img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CENTER: Information */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-emerald-700 uppercase">
              {product.brand || categoryName}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5 mb-2">{product.name}</h2>
            
            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50/80 border border-emerald-200/60 text-emerald-800 text-xs font-semibold mb-3">
              SKU: {product.sku || 'N/A'}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/50">
                <Tag size={12} /> {categoryName}
              </span>
              
              {product.rating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/50">
                  <Star size={12} className="fill-amber-400 text-amber-400" /> {product.rating} ({product.numReviews || product.reviewsCount || 1} Review)
                </span>
              )}

              {product.bestSeller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50/70 text-amber-800 text-xs font-semibold border border-amber-200/50">
                  <Flame size={12} className="text-amber-600" /> Best Seller
                </span>
              )}

              {product.featured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50/60 text-emerald-800 text-xs font-semibold border border-emerald-200/50">
                  <Star size={12} className="text-emerald-600" /> Featured
                </span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-slate-600 text-xs leading-relaxed mb-2">{product.shortDescription}</p>
            )}
            
            {product.description && (
              <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-wrap">{product.description}</p>
            )}
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Bottom info row for Origin, Weight, Packaging */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-slate-700 text-xs">
            {product.origin && (
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Origin</p>
                  <p className="font-semibold text-slate-800">{product.origin}</p>
                </div>
              </div>
            )}
            {product.weight && (
              <div className="flex items-center gap-2">
                <Scale size={15} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Weight</p>
                  <p className="font-semibold text-slate-800">{product.weight}</p>
                </div>
              </div>
            )}
            {product.packaging && (
              <div className="flex items-center gap-2">
                <Package size={15} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Packaging</p>
                  <p className="font-semibold text-slate-800 truncate">{product.packaging}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Bordered summary panel */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200/60">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Price</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">₹{price}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Compare Price</p>
              <p className="text-sm font-semibold text-slate-400 line-through mt-1">
                {comparePrice > 0 ? `₹${comparePrice}` : 'N/A'}
              </p>
            </div>
          </div>

          {comparePrice > price && (
            <div className="pb-3 border-b border-slate-200/60">
              <p className="text-[11px] font-medium text-slate-400">You Save</p>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">
                ₹{saving} ({discountPercentage}% OFF)
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200/60">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Stock</p>
              <p className={`text-xs font-bold mt-1 ${product.stock <= (product.lowStockThreshold || 5) ? 'text-rose-600' : 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block'}`}>
                {product.stock} in stock
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Low Stock Threshold</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">{product.lowStockThreshold || 10} units</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Status</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${product.active !== false ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                <span className="text-xs font-semibold text-slate-800">
                  {product.active !== false ? 'Active' : 'Draft'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400">Product Type</p>
              <p className="text-xs font-semibold text-slate-800 mt-1">{product.productType || 'Simple Product'}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. LOWER SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* LEFT COLUMN: Product Information card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Info size={16} className="text-emerald-600" />
            <span>Product Information</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Brand</span>
              <span className="font-semibold text-slate-800">{product.brand || 'AFFORA'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Category</span>
              <span className="font-semibold text-slate-800">{categoryName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">SKU</span>
              <span className="font-semibold text-slate-800">{product.sku || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Slug</span>
              <span className="font-semibold text-slate-800">{product.slug || product.name?.toLowerCase().replace(/\s+/g, '-')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Featured</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} /> {product.featured ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Best Seller</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={13} /> {product.bestSeller ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Status</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {product.active !== false ? 'Active' : 'Draft'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">Created At</span>
              <span className="font-semibold text-slate-800">
                {product.createdAt ? new Date(product.createdAt).toLocaleString() : '30 Aug 2026, 11:28 AM'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Updated At</span>
              <span className="font-semibold text-slate-800">
                {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : '30 Aug 2026, 11:28 AM'}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Three stacked cards */}
        <div className="space-y-6">
          
          {/* Ingredients */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Tag size={15} className="text-emerald-600" />
              <span>Ingredients</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
              {product.ingredients ? (
                Array.isArray(product.ingredients) ? (
                  product.ingredients.map((item, idx) => <li key={idx}>{item}</li>)
                ) : (
                  <li>{product.ingredients}</li>
                )
              ) : (
                <li>100% Natural Cloves</li>
              )}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>Benefits</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
              {product.benefits ? (
                Array.isArray(product.benefits) ? (
                  product.benefits.map((item, idx) => <li key={idx}>{item}</li>)
                ) : (
                  <li>{product.benefits}</li>
                )
              ) : (
                <>
                  <li>Rich natural aroma</li>
                  <li>Premium Kerala cloves</li>
                  <li>Carefully hand-selected</li>
                </>
              )}
            </ul>
          </div>

          {/* Usage Instructions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Box size={15} className="text-emerald-600" />
              <span>Usage Instructions</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.usageInstructions || product.usage || 'Use in biryani, curries, tea, desserts and other recipes.'}
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: Three stacked cards */}
        <div className="space-y-6">
          
          {/* Storage Instructions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Package size={15} className="text-emerald-600" />
              <span>Storage Instructions</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.storageInstructions || 'Store in a cool, dry place away from direct sunlight.'}
            </p>
          </div>

          {/* Pricing Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <IndianRupee size={15} className="text-emerald-600" />
              <span>Pricing Details</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Sale Price</span>
                <span className="font-semibold text-slate-800">₹{price}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Compare Price</span>
                <span className="font-semibold text-slate-400 line-through">₹{comparePrice}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">You Save</span>
                <span className="font-bold text-emerald-600">₹{saving} ({discountPercentage}% OFF)</span>
              </div>
            </div>
          </div>

          {/* Product Ratings */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Star size={15} className="text-amber-500 fill-amber-400" />
              <span>Product Ratings</span>
            </div>
            {product.rating > 0 ? (
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-black text-slate-900">{product.rating}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500">{product.numReviews || product.reviewsCount || 1} Review</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No ratings yet</p>
            )}
          </div>

        </div>

      </div>

      {/* 4. VARIANTS SECTION */}
      {product.variants && product.variants.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center gap-2 text-slate-900 mb-4 font-bold text-sm">
            <Layers size={18} className="text-emerald-600" />
            <span>Variants</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.variants.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-xs font-bold text-slate-900">{v.weight || v.name || `Variant ${i+1}`}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">SKU: {v.sku || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600">₹{v.price}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Stock: {v.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// Helper SVG Icon component
function ShieldCheckIcon(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}