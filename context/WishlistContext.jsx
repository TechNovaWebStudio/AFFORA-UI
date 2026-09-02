'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '../services/userApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await userApi.getWishlist();
      setWishlist(res.data?.wishlist || res.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Optimistic update
    const isCurrentlyInWishlist = wishlist.some(item => 
      (typeof item === 'object' ? item._id === productId || item.product === productId || item.product?._id === productId : item === productId)
    );

    try {
      const res = await userApi.toggleWishlist({ productId });
      setWishlist(res.data?.wishlist || res.data || []);
    } catch (error) {
      console.error('Failed to toggle wishlist', error);
      // Revert optimism by re-fetching
      fetchWishlist();
      toast.error('Failed to update wishlist. Please try again.');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => {
      if (typeof item === 'object') {
        return item._id === productId || item.product === productId || item.product?._id === productId;
      }
      return item === productId;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
