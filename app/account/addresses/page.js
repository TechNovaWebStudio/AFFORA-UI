'use client';

import React, { useState } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { usePopup } from '../../../context/PopupContext';
import { api } from '../../../lib/api';
import GlassButton from '../../../components/ui/GlassButton';

export default function AddressesPage() {
  const { user, updateProfile } = useAuth(); // We'll just fetch `/auth/me` by tricking updateProfile or reloading
  const { toast } = useToast();
  const { confirm } = usePopup();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const [formData, setFormData] = useState({
    address: '',
    apartment: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/users/address', formData);
      setShowAddForm(false);
      setFormData({ address: '', apartment: '', city: '', state: 'Kerala', pincode: '', isDefault: false });
      toast.success('Address added successfully');
      window.location.reload(); // Quick way to refresh user state
    } catch (err) {
      setError(err.message || 'Failed to add address');
      toast.error(err.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm('Are you sure you want to delete this address?', { title: 'Delete Address?' });
    if (!isConfirmed) return;
    try {
      await api.delete(`/users/address/${id}`);
      toast.success('Address deleted successfully');
      window.location.reload();
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
    }
  };

  const addresses = user?.address || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-border">
        <h2 className="text-2xl font-display font-semibold text-brand-dark">Saved Addresses</h2>
        <GlassButton variant="primary" onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 px-4 py-2">
          <Plus size={18} /> {showAddForm ? 'Cancel' : 'Add New'}
        </GlassButton>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6">{error}</div>}

      {showAddForm && (
        <form onSubmit={handleAddAddress} className="mb-8 p-6 bg-brand-light/30 border border-brand-border rounded-xl">
          <h3 className="font-semibold text-brand-dark mb-4">Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Address (Street, Area)" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary md:col-span-2" />
            <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, etc. (optional)" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary md:col-span-2" />
            <input type="text" name="city" required value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary" />
            <div className="grid grid-cols-2 gap-4">
              <select name="state" required value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary">
                <option value="Kerala">Kerala</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              <input type="text" name="pincode" required value={formData.pincode} onChange={handleInputChange} placeholder="PIN Code" className="w-full px-4 py-3 rounded-xl border border-brand-border focus:outline-none focus:border-brand-primary" />
            </div>
            <label className="flex items-center gap-2 md:col-span-2 mt-2">
              <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="w-4 h-4 text-brand-primary" />
              <span className="text-sm text-brand-textMain">Set as default address</span>
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <GlassButton type="submit" variant="primary" disabled={loading}>{loading ? 'Saving...' : 'Save Address'}</GlassButton>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showAddForm ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 text-brand-textSub">
            <MapPin size={32} />
          </div>
          <h3 className="text-lg font-semibold text-brand-dark mb-2">No addresses saved</h3>
          <p className="text-brand-textSub">Add an address for faster checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address._id} className="border border-brand-border rounded-xl p-4 relative flex flex-col group hover:border-brand-primary transition-colors">
              {address.isDefault && (
                <span className="absolute top-4 right-4 bg-brand-primary/10 text-brand-primary text-xs font-semibold px-2 py-1 rounded-md">Default</span>
              )}
              <h4 className="font-semibold text-brand-dark mb-2">{user.name}</h4>
              <p className="text-sm text-brand-textSub leading-relaxed flex-grow">
                {address.address}
                {address.apartment && <><br />{address.apartment}</>}
                <br />{address.city}, {address.state} {address.pincode}
              </p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-brand-border">
                <button onClick={() => handleDelete(address._id)} className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
