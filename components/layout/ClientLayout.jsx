'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import MobileAppBar from './MobileAppBar';
import MobileBottomNavbar from './MobileBottomNavbar';
import MobileDrawer from './MobileDrawer';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

const ClientLayout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar onOpenDrawer={() => setIsDrawerOpen(true)} />
      {/* <MobileAppBar onOpenDrawer={() => setIsDrawerOpen(true)} /> */}
      
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>

      <Footer />
      <MobileBottomNavbar />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
};

export default ClientLayout;
