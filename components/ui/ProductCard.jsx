'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Check, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const isWishlisted = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id, 1, product.weight || '100g');
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  };

  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col bg-white/80 backdrop-blur-xl border border-brand-border/60 rounded-3xl overflow-hidden shadow-glass hover:shadow-glass-lg hover:border-brand-primary/40 transition-all duration-300 transform hover:-translate-y-1.5">
      {/* Image Container */}
      <Link href={`/products/${product.slug || product._id}`} className="relative aspect-square bg-gradient-to-br from-brand-light/60 to-white overflow-hidden p-6 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <img 
            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url} 
            alt={product.name} 
            className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-light/80 rounded-2xl">
            <span className="text-brand-primary font-display text-4xl font-bold opacity-40">{product.name?.substring(0,2).toUpperCase()}</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.bestSeller && (
            <span className="bg-brand-primary text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Best Seller
            </span>
          )}
          {discountPercent && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Actions */}
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-brand-border/60 text-brand-dark hover:text-red-500 shadow-sm transition-all duration-200 z-10"
          aria-label="Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} className={isWishlisted ? 'text-red-500' : ''} />
        </button>

        {/* Hover Quick View Button */}
        <div className="absolute inset-0 bg-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-md text-brand-dark text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Eye size={14} /> Quick View
          </span>
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <Link href={`/products/${product.slug || product._id}`}>
            <h3 className="font-display font-bold text-brand-dark hover:text-brand-primary transition-colors text-base line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
            <Star size={11} fill="#10B981" className="text-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-800">{product.rating || '4.9'}</span>
          </div>
        </div>

        <p className="text-brand-textSub text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
          {product.shortDescription || '100% pure authentic Indian spice carefully selected for natural aroma.'}
        </p>

        {/* Price & Cart CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-brand-border/50">
          <div>
            <span className="text-[11px] text-brand-textSub font-medium block">{product.weight || '100g'}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-display font-bold text-brand-dark">₹{product.price}</span>
              {product.comparePrice > product.price && (
                <span className="text-xs text-brand-textSub line-through">₹{product.comparePrice}</span>
              )}
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`p-3 rounded-2xl transition-all duration-200 flex items-center justify-center ${
              added 
                ? 'bg-emerald-600 text-white scale-105' 
                : 'bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white hover:shadow-md'
            }`}
            title="Add to Cart"
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

