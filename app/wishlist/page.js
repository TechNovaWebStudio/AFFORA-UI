'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Loader } from 'lucide-react';
import GlassButton from '../../components/ui/GlassButton';
import ProductCard from '../../components/ui/ProductCard';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export default function Wishlist() {
  const { wishlist, loading } = useWishlist();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/wishlist');
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="bg-brand-bg min-h-[70vh] flex items-center justify-center">
        <Loader className="animate-spin text-brand-primary mb-4" size={40} />
      </div>
    );
  }

  if (!user) return null; // will redirect

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="bg-brand-bg min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center text-brand-primary mb-6">
          <Heart size={40} className="fill-brand-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-brand-dark mb-2">Your Wishlist is Empty</h2>
        <p className="text-brand-textSub mb-8 text-center max-w-sm">Save your favorite spices and easily find them here when you're ready to order.</p>
        <Link href="/products">
          <GlassButton variant="primary">Explore Spices</GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-display text-brand-dark mb-8">My Wishlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map((item) => {
            const product = typeof item === 'object' ? (item.product || item) : null;
            if (!product || !product._id) return null;
            return <ProductCard key={product._id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
}
