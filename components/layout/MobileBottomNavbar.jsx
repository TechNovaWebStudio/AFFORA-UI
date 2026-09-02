'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const MobileBottomNavbar = () => {
  const pathname = usePathname();
  const { cart } = useCart();
  const cartCount = cart?.length || 0;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/products', icon: Grid },
    { name: 'Categories', href: '/categories', icon: Grid },
    { name: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
    { name: 'Account', href: '/account', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <nav className="relative overflow-hidden bg-white/55 backdrop-blur-[28px] backdrop-saturate-[160%] border-t border-white/70 shadow-[0_-4px_25px_rgba(21,61,45,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] h-[78px] px-2 py-1.5 flex items-center">
        
        {/* Subtle top border highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="relative z-10 grid grid-cols-5 w-full h-full items-center">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-label={item.name}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 h-full rounded-[20px] transition-all duration-300 ease-out transform active:scale-90 active:opacity-80 ${
                  isActive
                    ? 'bg-white/35 border border-white/25 shadow-[0_8px_20px_rgba(27,120,75,0.10),inset_0_1px_0_rgba(255,255,255,0.75)]'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className="relative p-0.5 transition-transform duration-300 ease-out">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    className={isActive ? 'text-[#16834F]' : 'text-[#405A50]'}
                  />

                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#16834F] text-white text-[10px] font-bold leading-none flex items-center justify-center rounded-full ring-2 ring-white/80 shadow-[0_3px_8px_rgba(22,131,79,0.25)]">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10.5px] leading-none tracking-[-0.01em] transition-all duration-300 ease-out ${
                    isActive
                      ? 'font-semibold text-[#16834F]'
                      : 'font-medium text-[#465D54]'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MobileBottomNavbar;