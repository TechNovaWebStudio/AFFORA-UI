import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-brand-dark text-white text-center py-2 px-4 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 border-b border-brand-primary/20">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span>THE AUTHENTIC TASTE OF INDIA, WORLDWIDE — Free Domestic Shipping Above ₹999</span>
    </div>
  );
};

export default AnnouncementBar;
