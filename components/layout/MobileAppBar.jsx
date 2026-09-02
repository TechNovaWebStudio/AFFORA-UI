import React from 'react';
import Link from 'next/link';
import { Menu, Heart, ShoppingBag, ArrowLeft, Search } from 'lucide-react';

const MobileAppBar = ({ onOpenDrawer, isInner = false, title = "AFFORA", onBack }) => {
  return (
    <header className="md:hidden sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isInner ? (
            <button onClick={onBack} className="p-2 -ml-2 text-brand-textMain">
              <ArrowLeft size={24} strokeWidth={1.5} />
            </button>
          ) : (
            <button onClick={onOpenDrawer} className="p-2 -ml-2 text-brand-textMain">
              <Menu size={24} strokeWidth={1.5} />
            </button>
          )}
          
          {isInner ? (
            <h1 className="font-medium text-brand-textMain text-lg truncate max-w-[200px]">{title}</h1>
          ) : (
            <Link href="/" className="font-display text-xl font-bold tracking-widest text-brand-dark">
              {title}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isInner && (
            <button className="p-2 text-brand-textMain">
              <Search size={22} strokeWidth={1.5} />
            </button>
          )}
          <Link href="/wishlist" className="p-2 text-brand-textMain">
            <Heart size={22} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" className="relative p-2 text-brand-textMain">
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileAppBar;
