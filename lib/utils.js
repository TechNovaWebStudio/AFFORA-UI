export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calcDiscount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

export const CATEGORIES = [
  { name: 'Cloves', slug: 'cloves', color: 'bg-red-50' },
  { name: 'Black Pepper', slug: 'black-pepper', color: 'bg-gray-50' },
  { name: 'Cardamom', slug: 'cardamom', color: 'bg-green-50' },
  { name: 'Dried Ginger', slug: 'dried-ginger', color: 'bg-yellow-50' },
  { name: 'Turmeric', slug: 'turmeric', color: 'bg-amber-50' },
];

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const PROCESS_STEPS = [
  { title: 'Sourcing', desc: 'Carefully selected from trusted farms' },
  { title: 'Quality Selection', desc: 'Hand-picked for size and purity' },
  { title: 'Cleaning', desc: 'Thoroughly cleaned and sorted' },
  { title: 'Processing', desc: 'Expert processing to retain flavor' },
  { title: 'Quality Checking', desc: 'Rigorous quality inspection' },
  { title: 'Packaging', desc: 'Hygienic food-grade packaging' },
  { title: 'Delivery', desc: 'Fresh delivery to your doorstep' },
];

export const WHY_AFFORA = [
  { title: 'Carefully Sourced', desc: 'Spices sourced from regions known for quality production' },
  { title: 'Quality Processing', desc: 'Processed with attention to aroma, color, and purity' },
  { title: 'Hygienic Packaging', desc: 'Packed in food-grade sealed pouches' },
  { title: 'Freshness Focus', desc: 'Small batch processing for consistent quality' },
  { title: 'Reliable Delivery', desc: 'Pan-India shipping with order tracking' },
  { title: 'Customer Satisfaction', desc: 'Dedicated support for every order' },
];
