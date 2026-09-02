'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProductForm from '../../../../../components/admin/ProductForm';
import { adminApi } from '../../../../../services/adminApi';
import { useToast } from '../../../../../context/ToastContext';

export default function AdminEditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await adminApi.getProducts();
        const allProducts = prodRes.data.products || prodRes.data.data || prodRes.data;
        const product = allProducts.find((p) => p._id === id);

        if (product) {
          setInitialData({
            ...product,
            category: product.category?._id || product.category,
            categoryName: product.categoryName || product.category?.name || '',
            images: product.images || [],
            offerEnabled: product.offer?.enabled || false,
            offerType: product.offer?.type || 'percentage',
            offerValue: product.offer?.value || '',
            offerStartDate: product.offer?.startDate || '',
            offerEndDate: product.offer?.endDate || '',
            shippingEnabled: product.shipping?.enabled || false,
            shippingType: product.shipping?.type || 'fixed',
            shippingCharge: product.shipping?.charge || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, toast]);

  const handleSubmit = async (formData, imageFiles, variants) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        comparePrice: Number(formData.comparePrice) || 0,
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        variants,
        offer: formData.offerEnabled ? {
          enabled: true,
          type: formData.offerType,
          value: Number(formData.offerValue),
          startDate: formData.offerStartDate,
          endDate: formData.offerEndDate
        } : { enabled: false },
        shipping: formData.shippingEnabled ? {
          enabled: true,
          type: formData.shippingType,
          charge: Number(formData.shippingCharge) || 0
        } : { enabled: false }
      };

      const submitData = new FormData();
      Object.keys(payload).forEach(key => {
        if (key === 'images') return;
        if (typeof payload[key] === 'object' && payload[key] !== null) {
          submitData.append(key, JSON.stringify(payload[key]));
        } else {
          submitData.append(key, payload[key]);
        }
      });

      const existingImages = [];
      imageFiles.forEach((item, index) => {
        if (item.isExisting) {
          existingImages.push({ url: item.url, public_id: item.public_id });
        } else {
          submitData.append('images', item);
        }
      });
      submitData.append('existingImages', JSON.stringify(existingImages));

      await adminApi.updateProduct(id, submitData);
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !initialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-xs font-bold tracking-wider uppercase">Loading Product Details...</p>
      </div>
    );
  }

  return (
    <ProductForm 
      initialData={initialData} 
      onSubmit={handleSubmit} 
      saving={saving} 
      isEdit={true} 
    />
  );
}