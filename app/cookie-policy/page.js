import React from 'react';

export default function CookiePolicyPage() {
  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl border border-brand-border shadow-sm">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-8 text-center">Cookie Policy</h1>
        
        <div className="space-y-6 text-brand-textSub text-sm md:text-base leading-relaxed">
          <p>Last updated: August 2026</p>
          
          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">1. What are cookies?</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work more efficiently and provide information to the owners of the site.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">2. How we use cookies</h2>
          <p>We use cookies to remember your preferences, such as your shopping cart contents and login status. This helps us provide you with a better, more personalized shopping experience.</p>

          <h2 className="text-xl font-display font-semibold text-brand-dark mt-8 mb-4">3. Managing cookies</h2>
          <p>Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience and lose access to certain features like the shopping cart.</p>
        </div>
      </div>
    </div>
  );
}
