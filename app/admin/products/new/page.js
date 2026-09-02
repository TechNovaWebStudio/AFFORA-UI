'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm from '../../../../components/admin/ProductForm';
import { adminApi } from '../../../../services/adminApi';
import { useToast } from '../../../../context/ToastContext';

export default function AdminNewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

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

      const filesToUpload = imageFiles.filter(img => !img.isExisting);
      filesToUpload.forEach(file => submitData.append('images', file));
      
      await adminApi.createProduct(submitData);
      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProductForm 
      initialData={{}} 
      onSubmit={handleSubmit} 
      saving={saving} 
      isEdit={false} 
    />
  );
}