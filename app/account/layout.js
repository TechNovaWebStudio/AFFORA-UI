'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AccountLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="animate-pulse text-brand-primary font-medium text-lg">Loading your account...</div>
      </div>
    );
  }

  const links = [
    { name: 'Dashboard', href: '/account', icon: User },
    { name: 'Profile', href: '/account/profile', icon: User },
    { name: 'Orders', href: '/account/orders', icon: Package },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="bg-brand-bg min-h-screen py-8 md:py-12 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-brand-dark">My Account</h1>
          <p className="text-sm text-brand-textSub mt-1">Welcome back, {user?.name || 'User'}!</p>
        </div>

        {/* Responsive Grid: Mobile stacks top navigation or full-width layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start">
          
          {/* Navigation: Horizontal scrollable strip on mobile, Sticky Sidebar on desktop */}
          <aside className="md:col-span-1 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-none md:sticky md:top-6">
            <nav className="flex md:flex-col flex-row space-x-2 md:space-x-0 md:space-y-2 min-w-max md:min-w-0">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm md:text-base ${
                      isActive 
                        ? 'bg-brand-primary text-white shadow-sm' 
                        : 'text-brand-textMain bg-white md:bg-transparent hover:bg-white hover:text-brand-primary border md:border-0 border-brand-border'
                    }`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 bg-white md:bg-transparent hover:bg-red-50 transition-colors font-medium text-sm md:text-base border md:border-t md:border-x-0 md:border-b-0 border-brand-border shrink-0"
              >
                <LogOut size={18} className="shrink-0" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Dynamic Content Area */}
          <main className="md:col-span-3 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}