'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'affora_guest_cart';

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const loadGuestCart = useCallback(async () => {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) return setCart({ items: [] });
    try {
      const guestItems = JSON.parse(stored);
      const items = [];
      for (const item of guestItems) {
        try {
          const res = await api.get(`/products/${item.slug || item.productId}`);
          const product = res.data?.product || res.data;
          if (product) {
            items.push({
              _id: item._id || `${product._id}-${item.weight}`,
              product,
              quantity: item.quantity,
              price: item.price || product.price,
              weight: item.weight || product.weight,
            });
          }
        } catch { /* skip invalid items */ }
      }
      setCart({ items });
    } catch {
      setCart({ items: [] });
    }
  }, []);

  const loadCart = useCallback(async () => {
    if (!user) {
      await loadGuestCart();
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  }, [user, loadGuestCart]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const saveGuestCart = (items) => {
    const guestItems = items.map((item) => ({
      _id: item._id,
      productId: item.product._id,
      slug: item.product.slug,
      quantity: item.quantity,
      price: item.price,
      weight: item.weight,
    }));
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestItems));
  };

  const addToCart = async (productParam, quantity = 1, weight) => {
    let productObj = typeof productParam === 'object' ? productParam : null;
    let productId = typeof productParam === 'string' ? productParam : productParam?._id;

    if (!productObj && productId) {
      try {
        const res = await api.get(`/products/${productId}`);
        productObj = res.data?.product || res.data;
      } catch (err) {
        console.error('Failed to fetch product for cart:', err);
      }
    }

    if (!productObj) return;

    const price = weight && productObj.weightOptions?.length
      ? productObj.weightOptions.find((w) => w.weight === weight)?.price || productObj.price
      : productObj.price;

    if (!user) {
      const existing = cart.items.find(
        (i) => i.product._id === productObj._id && i.weight === (weight || productObj.weight)
      );
      let newItems;
      if (existing) {
        newItems = cart.items.map((i) =>
          i._id === existing._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [...cart.items, {
          _id: `${productObj._id}-${weight || productObj.weight}`,
          product: productObj,
          quantity,
          price,
          weight: weight || productObj.weight,
        }];
      }
      setCart({ items: newItems });
      saveGuestCart(newItems);
      return;
    }

    const res = await api.post('/cart/add', { productId: productObj._id, quantity, weight });
    setCart(res.data);
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) {
      const newItems = quantity <= 0
        ? cart.items.filter((i) => i._id !== itemId)
        : cart.items.map((i) => i._id === itemId ? { ...i, quantity } : i);
      setCart({ items: newItems });
      saveGuestCart(newItems);
      return;
    }
    const res = await api.put('/cart/update', { itemId, quantity });
    setCart(res.data);
  };

  const removeItem = async (itemId) => {
    if (!user) {
      const newItems = cart.items.filter((i) => i._id !== itemId);
      setCart({ items: newItems });
      saveGuestCart(newItems);
      return;
    }
    const res = await api.delete(`/cart/${itemId}`);
    setCart(res.data);
  };

  const clearCart = async () => {
    if (!user) {
      setCart({ items: [] });
      localStorage.removeItem(GUEST_CART_KEY);
      return;
    }
    await api.delete('/cart/clear');
    setCart({ items: [] });
  };

  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, loading, addToCart, updateQuantity, removeItem, clearCart, loadCart, itemCount, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
