import React from 'react';

export default function FAQ() {
  const faqs = [
    {
      q: "Where do you source your spices from?",
      a: "We source our spices directly from sustainable farms in Kerala, Karnataka, and Tamil Nadu, ensuring the highest quality and fair trade practices."
    },
    {
      q: "Are your spices organic?",
      a: "Our spices are 100% natural, grown using traditional methods without synthetic pesticides. While we are in the process of getting official organic certification for all farms, our purity standards exceed standard requirements."
    },
    {
      q: "How long do the spices stay fresh?",
      a: "When stored in an airtight container in a cool, dark place, our whole spices retain their potency for up to 2 years. Ground spices are best used within 6-8 months."
    },
    {
      q: "Do you offer wholesale purchasing?",
      a: "Yes, we supply to restaurants, bakeries, and specialty food stores. Please visit our Wholesale page for more information."
    }
  ];

  return (
    <div className="bg-brand-bg min-h-screen pt-12 pb-24 px-4 md:px-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-brand-textSub text-center mb-12">Everything you need to know about our products and services.</p>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
              <h3 className="font-display font-semibold text-lg text-brand-dark mb-3">{faq.q}</h3>
              <p className="text-brand-textSub text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
