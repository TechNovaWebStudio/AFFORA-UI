'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Lock, 
  RotateCcw, 
  ArrowLeft 
} from 'lucide-react';
import GlassButton from '../../components/ui/GlassButton';
import { useCart } from '../../context/CartContext';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem, subtotal } = useCart();
  const cartItems = cart?.items || [];
  
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : (subtotal > 0 ? 50 : 0);
  const total = subtotal + shipping;

  const [selectedItems, setSelectedItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleRemoveAllSelected = () => {
    selectedItems.forEach((id) => removeItem(id));
    setSelectedItems([]);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode.trim().toUpperCase());
      setCouponCode('');
    }
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-brand-dark font-display">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-brand-bg">
        <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center text-brand-primary mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-display font-bold text-brand-dark mb-2">Your Cart is Empty</h2>
        <p className="text-brand-textSub mb-8 text-center max-w-sm">Looks like you haven't added any premium spices to your cart yet.</p>
        <Link href="/products">
          <GlassButton variant="primary">Start Shopping</GlassButton>
        </Link>
      </div>
    );
  }

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <div className="bg-brand-bg min-h-screen pt-4 md:pt-6 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brand-textSub mb-4">
          <Link className="hover:text-brand-primary transition-colors" href="/">Home</Link>
          <ChevronRight size={14} />
          <span className="text-brand-dark font-medium">Cart</span>
        </div>

        {/* Heading & Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-dark">
            Your Cart ({totalItemsCount})
          </h1>
          <p className="text-brand-textSub text-sm md:text-base mt-1">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Cart Section */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-light/20">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    aria-label="Select All Items"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-brand-border"
                  />
                  <span className="text-sm font-medium text-brand-dark">
                    Select All ({cartItems.length} Items)
                  </span>
                </label>
                {selectedItems.length > 0 && (
                  <button 
                    onClick={handleRemoveAllSelected}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                    <span>Remove All</span>
                  </button>
                )}
              </div>

              {/* Product Rows */}
              <div className="divide-y divide-brand-border">
                {cartItems.map((item) => {
                  const isChecked = selectedItems.includes(item._id);
                  const imageUrl = item.product?.images?.length > 0 
                    ? (typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0]?.url)
                    : null;
                  
                  const badge = item.product?.badge || null;

                  return (
                    <div key={item._id} className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-brand-light/10 transition-colors">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <input 
                          type="checkbox" 
                          aria-label={`Select ${item.product?.name || 'product'}`}
                          checked={isChecked}
                          onChange={() => handleSelectItem(item._id)}
                          className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-brand-border flex-shrink-0"
                        />
                        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-brand-light rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-brand-border/40">
                          {imageUrl ? (
                            <Image 
                              src={imageUrl} 
                              alt={item.product?.name || 'Product Image'} 
                              className="object-cover" 
                              fill 
                              sizes="(max-width: 768px) 80px, 96px" 
                            />
                          ) : (
                            <span className="text-xs text-brand-textSub font-bold">IMAGE</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col flex-grow w-full sm:w-auto">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-display font-bold text-brand-dark text-base md:text-lg">
                              {item.product?.name || 'Unnamed Product'}
                            </h3>
                            <p className="text-xs md:text-sm text-brand-textSub mt-0.5">{item.weight}</p>
                            {badge && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-brand-light text-brand-primary text-[10px] font-semibold rounded-full border border-brand-primary/20">
                                {badge}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => removeItem(item._id)} 
                            aria-label="Remove item"
                            className="text-brand-textSub hover:text-red-500 transition-colors p-1 sm:hidden"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-dark text-base">
                              ₹{item.price || 0}
                            </span>
                          </div>

                          <div className="flex items-center border border-brand-border rounded-lg px-2 py-1 bg-white shadow-2xs">
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                              aria-label="Decrease quantity"
                              className="text-brand-textSub hover:text-brand-primary p-1 transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="font-medium text-sm text-brand-dark w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                              aria-label="Increase quantity"
                              className="text-brand-textSub hover:text-brand-primary p-1 transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <div className="hidden sm:flex items-center gap-4">
                            <span className="font-bold text-brand-dark text-base">
                              ₹{(item.price || 0) * item.quantity}
                            </span>
                            <button 
                              onClick={() => removeItem(item._id)} 
                              aria-label="Remove item"
                              className="text-brand-textSub hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
              <h2 className="font-display font-bold text-xl text-brand-dark mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-brand-textSub">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="text-brand-dark font-medium">₹{subtotal}</span>
                </div>

                <div className="flex justify-between text-brand-textSub">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-brand-primary font-medium" : "text-brand-dark font-medium"}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-brand-textSub pt-4 border-t border-brand-border">
                  <span className="text-base font-bold text-brand-dark">Total</span>
                  <span className="text-lg font-bold text-brand-dark">₹{total}</span>
                </div>
                <p className="text-[11px] text-brand-textSub">Inclusive of all taxes</p>
              </div>

              <Link className="block w-full mb-3" href="/checkout">
                <GlassButton className="w-full justify-center text-center py-3" variant="primary">
                  Proceed to Checkout →
                </GlassButton>
              </Link>

              <Link className="block w-full text-center" href="/products">
                <button className="w-full py-2.5 px-4 rounded-xl border border-brand-border text-brand-dark hover:bg-brand-light/30 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <ArrowLeft size={15} />
                  <span>Continue Shopping</span>
                </button>
              </Link>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
              <h3 className="font-display font-bold text-base text-brand-dark mb-3">Have a Coupon Code?</h3>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow px-3 py-2 text-sm bg-brand-light/30 border border-brand-border rounded-xl focus:outline-none focus:border-brand-primary text-brand-dark"
                />
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white transition-colors text-sm font-medium rounded-xl border border-brand-primary/20"
                >
                  Apply
                </button>
              </form>
              {appliedCoupon && (
                <div className="mt-3 flex items-center justify-between text-xs text-brand-primary font-medium bg-brand-light/50 px-3 py-1.5 rounded-lg">
                  <span>Coupon {appliedCoupon} registered (UI Only)</span>
                  <button type="button" onClick={() => setAppliedCoupon(null)} className="text-red-500 hover:underline">Remove</button>
                </div>
              )}
            </div>

            {/* Trust Section */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-light text-brand-primary rounded-lg">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-dark">100% Pure & Natural</h4>
                  <p className="text-xs text-brand-textSub">No additives or preservatives</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-light text-brand-primary rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-dark">Lab Tested for Quality</h4>
                  <p className="text-xs text-brand-textSub">Every batch tested for purity</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-light text-brand-primary rounded-lg">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-dark">Secure Payments</h4>
                  <p className="text-xs text-brand-textSub">100% safe & secure checkout</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-brand-light text-brand-primary rounded-lg">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-brand-dark">Easy Returns</h4>
                  <p className="text-xs text-brand-textSub">7 days return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}