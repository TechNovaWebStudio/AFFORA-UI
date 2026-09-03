'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Truck, 
  ShieldCheck, 
  Leaf, 
  Heart, 
  Minus, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Check, 
  Globe, 
  Award, 
  ArrowRight 
} from 'lucide-react';
import GlassButton from '../../../components/ui/GlassButton';
import ProductCard from '../../../components/ui/ProductCard';
import { productApi } from '../../../services/productApi';
import { userApi } from '../../../services/userApi';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailsPage({ params }) {
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  
  const [activeTab, setActiveTab] = useState('Description');
  
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const slug = resolvedParams?.slug;
        const res = await productApi.getBySlug(slug);
        const fetchedProduct = res.data.product || res.data;
        const fetchedRelated = res.data.related || [];
        const fetchedReviews = res.data.reviews || [];
        setProduct(fetchedProduct);
        setRelatedProducts(fetchedRelated);
        setReviews(fetchedReviews);
        if (fetchedProduct.weightOptions?.length > 0) {
          setSelectedWeight(fetchedProduct.weightOptions[0].weight);
        } else {
          setSelectedWeight(fetchedProduct.weight || '100g');
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params]);

  const handleAddToCart = async () => {
    await addToCart(product, quantity, selectedWeight);
    router.push('/cart');
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity, selectedWeight);
    router.push('/checkout');
  };

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 100)) setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const nextImage = () => {
    if (!product?.images || product.images.length === 0) return;
    setActiveImage(prev => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images || product.images.length === 0) return;
    setActiveImage(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  const currentPrice = product?.weightOptions?.length > 0 
    ? product.weightOptions.find(w => w.weight === selectedWeight)?.price || product.price 
    : product?.price;

  const currentComparePrice = product?.weightOptions?.length > 0 
    ? product.weightOptions.find(w => w.weight === selectedWeight)?.comparePrice || product.comparePrice 
    : product?.comparePrice;

  const discountPercentage = useMemo(() => {
    if (currentComparePrice && currentComparePrice > currentPrice) {
      return Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100);
    }
    return 0;
  }, [currentPrice, currentComparePrice]);

  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!reviews || reviews.length === 0) return dist;
    reviews.forEach(r => {
      const rate = Math.round(r.rating);
      if (dist[rate] !== undefined) {
        dist[rate] += 1;
      }
    });
    const total = reviews.length;
    const percentages = {};
    Object.keys(dist).forEach(key => {
      percentages[key] = total > 0 ? Math.round((dist[key] / total) * 100) : 0;
    });
    return percentages;
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return product?.rating || 4.5;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews, product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to write a review');
    setSubmittingReview(true);
    try {
      await userApi.createReview({
        productId: product._id,
        ...reviewForm
      });
      toast.success('Review submitted successfully! It will be visible after approval.');
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-textMain">Loading...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-textMain">Product not found.</div>;

  const imagesList = product.images && product.images.length > 0 
    ? product.images.map(img => typeof img === 'string' ? img : img?.url) 
    : [];

  const categoryName = typeof product.category === 'object' && product.category !== null 
    ? product.category.name 
    : product.category;

  return (
    <div className="bg-brand-bg min-h-screen py-6 md:py-12 px-2 sm:px-4 md:px-6">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-10 relative">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="aspect-square bg-brand-light/40 rounded-2xl md:rounded-3xl flex items-center justify-center relative overflow-hidden border border-brand-border/30 group">
               {imagesList.length > 0 ? (
                 <img 
                   src={imagesList[activeImage] || imagesList[0]} 
                   alt={product.name} 
                   className="object-cover w-full h-full transition-all duration-300" 
                 />
               ) : (
                 <span className="text-brand-textSub/30 font-display text-8xl font-bold">IMAGE</span>
               )}

               {imagesList.length > 1 && (
                 <>
                   <button 
                     onClick={prevImage}
                     className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-dark p-2 rounded-full shadow-md transition-all opacity-80 group-hover:opacity-100 flex items-center justify-center"
                     aria-label="Previous image"
                   >
                     <ChevronLeft size={18} />
                   </button>
                   <button 
                     onClick={nextImage}
                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-brand-dark p-2 rounded-full shadow-md transition-all opacity-80 group-hover:opacity-100 flex items-center justify-center"
                     aria-label="Next image"
                   >
                     <ChevronRight size={18} />
                   </button>
                 </>
               )}

               <button className="absolute bottom-4 right-4 bg-white/80 hover:bg-white backdrop-blur p-2 rounded-full text-brand-textMain shadow-sm transition-colors">
                 <Search size={18} />
               </button>
            </div>
            
            {imagesList.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imagesList.slice(0, 5).map((imgUrl, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 md:w-18 md:h-18 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-brand-border/60 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-7 flex flex-col">
            
            <div className="flex text-xs md:text-sm text-brand-textSub mb-2 gap-2 items-center">
              <Link className="hover:text-brand-primary" href="/">Home</Link>
              <span>/</span>
              <Link className="hover:text-brand-primary" href="/products">Products</Link>
              <span>/</span>
              <span className="text-brand-textMain font-medium truncate">{categoryName || 'Spices'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brand-dark mb-2">
              {product.name}
            </h1>

            <p className="text-sm md:text-base text-brand-textSub mb-4">
              {product.subtitle || product.tagline || "Pure flavor, pure aroma — straight from nature's finest farms."}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-5 pb-4 border-b border-brand-border/60">
              <div className="flex items-center gap-1 text-yellow-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={16} 
                    fill={star <= Math.round(Number(averageRating)) ? "currentColor" : "none"} 
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-brand-textMain">{averageRating}</span>
              <span className="text-sm text-brand-textSub">({reviews.length || product.numReviews || 0} reviews)</span>
              <span className="mx-2 text-brand-border">•</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${product.stock !== 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {product.stock !== 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-display font-bold text-brand-dark">₹{currentPrice}</span>
              {currentComparePrice > 0 && currentComparePrice > currentPrice && (
                <span className="text-base md:text-lg text-brand-textSub line-through">₹{currentComparePrice}</span>
              )}
              {discountPercentage > 0 && (
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 py-3 border-y border-brand-border/40 text-xs">
              <div className="flex flex-col items-center text-center p-1">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-1">
                  <Leaf size={14} />
                </div>
                <span className="font-medium text-brand-dark leading-tight">100% Pure & Natural</span>
              </div>
              <div className="flex flex-col items-center text-center p-1">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-1">
                  <ShieldCheck size={14} />
                </div>
                <span className="font-medium text-brand-dark leading-tight">No Added Preservatives</span>
              </div>
              <div className="flex flex-col items-center text-center p-1">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-1">
                  <Globe size={14} />
                </div>
                <span className="font-medium text-brand-dark leading-tight">Sourced from Local Farms</span>
              </div>
              <div className="flex flex-col items-center text-center p-1">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-1">
                  <Award size={14} />
                </div>
                <span className="font-medium text-brand-dark leading-tight">Export Quality</span>
              </div>
            </div>

            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">Select Weight</h3>
                <div className="flex flex-wrap gap-2">
                  {product.weightOptions.map((v) => (
                    <button 
                      key={v.weight}
                      onClick={() => setSelectedWeight(v.weight)}
                      className={`px-5 py-2 rounded-full border text-sm font-medium transition-all
                        ${selectedWeight === v.weight 
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold' 
                          : 'border-brand-border text-brand-textSub hover:border-brand-textSub bg-white'
                        }
                      `}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-between border border-brand-border rounded-xl px-3 py-1.5 w-32 bg-white">
                <button onClick={decreaseQuantity} className="text-brand-textSub hover:text-brand-primary p-1" aria-label="Decrease quantity"><Minus size={16} /></button>
                <span className="font-semibold text-brand-dark text-sm">{quantity}</span>
                <button onClick={increaseQuantity} className="text-brand-textSub hover:text-brand-primary p-1" aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
            </div>

            <div className="flex flex-row gap-3 items-center">
              <button 
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={loading || product.stock === 0}
                className="flex-1 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50"
              >
                Buy Now
              </button>

              <button 
                className="w-12 h-12 border border-brand-border hover:border-brand-primary rounded-xl flex items-center justify-center text-brand-textSub hover:text-red-500 transition-colors bg-white flex-shrink-0"
                aria-label="Add to Wishlist"
              >
                <Heart size={20} />
              </button>
            </div>

          </div>
        </div>

        <div className="mt-12 border-b border-brand-border flex gap-8 overflow-x-auto scrollbar-hide text-sm font-medium">
          {['Description', 'Features', 'Ingredients', 'Reviews', reviews.length === 0 ? 'Reviews' : `Reviews (${reviews.length})`, 'Shipping & Returns'].filter((v, i, a) => a.indexOf(v) === i).map((tab) => {
            const baseTabName = tab.startsWith('Reviews') ? 'Reviews' : tab;
            const isCurrent = activeTab === baseTabName || (tab.startsWith('Reviews') && activeTab === 'Reviews');
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.startsWith('Reviews') ? 'Reviews' : tab)}
                className={`pb-3 whitespace-nowrap transition-colors relative ${
                  isCurrent ? 'text-brand-dark font-semibold' : 'text-brand-textSub hover:text-brand-dark'
                }`}
              >
                {tab}
                {isCurrent && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-xl md:text-2xl font-display font-bold text-brand-dark">Product Description</h2>
            <p className="text-brand-textSub leading-relaxed text-sm md:text-base">
              {product.description || "Handpicked from the lush gardens, known for producing the world's best harvest. Carefully selected, sun-dried and packed to preserve natural oils, bold flavor and rich aroma. Perfect for everyday cooking, gourmet recipes and health-conscious lifestyles."}
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-sm text-brand-dark font-medium">
                <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Check size={12} />
                </div>
                <span>Rich in antioxidants and essential nutrients</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-dark font-medium">
                <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Check size={12} />
                </div>
                <span>Enhances authentic flavor in every single dish</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-dark font-medium">
                <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Check size={12} />
                </div>
                <span>Supports healthy digestion and natural wellness</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-[4/3] flex items-center justify-center shadow-md">
              {imagesList.length > 0 ? (
                <img src={imagesList[0]} alt="Promotional banner" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-brand-dark" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-wider font-semibold text-brand-primary mb-1">Pure Quality</span>
                <h3 className="text-xl md:text-2xl font-display font-bold mb-1">Pure Spice. Real Goodness.</h3>
                <p className="text-xs text-gray-200">Nature's finest, for a healthier you.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl md:text-2xl font-display font-bold text-brand-dark mb-6">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-brand-light/20 border border-brand-border/40 p-5 rounded-2xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                <Leaf size={20} />
              </div>
              <h4 className="font-semibold text-brand-dark text-sm mb-1">100% Natural</h4>
              <p className="text-xs text-brand-textSub">No artificial colors or flavors</p>
            </div>

            <div className="bg-brand-light/20 border border-brand-border/40 p-5 rounded-2xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <h4 className="font-semibold text-brand-dark text-sm mb-1">Premium Quality</h4>
              <p className="text-xs text-brand-textSub">Handpicked & carefully graded</p>
            </div>

            <div className="bg-brand-light/20 border border-brand-border/40 p-5 rounded-2xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                <SparklesIcon className="w-5 h-5 text-brand-primary" />
              </div>
              <h4 className="font-semibold text-brand-dark text-sm mb-1">Rich Aroma</h4>
              <p className="text-xs text-brand-textSub">Intense flavor in every grain</p>
            </div>

            <div className="bg-brand-light/20 border border-brand-border/40 p-5 rounded-2xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                <Truck size={20} />
              </div>
              <h4 className="font-semibold text-brand-dark text-sm mb-1">Farm Fresh</h4>
              <p className="text-xs text-brand-textSub">Sourced from trusted farmers</p>
            </div>

            <div className="bg-brand-light/20 border border-brand-border/40 p-5 rounded-2xl flex flex-col items-center text-center sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                <Globe size={20} />
              </div>
              <h4 className="font-semibold text-brand-dark text-sm mb-1">Sustainable</h4>
              <p className="text-xs text-brand-textSub">Supports local communities</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-light/15 border border-brand-border/50 p-6 rounded-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="text-brand-primary" size={18} />
              <h3 className="font-display font-bold text-brand-dark">Ingredients</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-brand-light flex-shrink-0 border border-brand-border/30">
                {imagesList.length > 0 ? (
                  <img src={imagesList[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-primary/10" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-brand-dark text-sm mb-1">{product.name}</h4>
                <p className="text-xs text-brand-textSub leading-relaxed">
                  {product.ingredients || "Nothing else. Just pure, farm-fresh authentic ingredients sourced directly."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-brand-light/15 border border-brand-border/50 p-6 rounded-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-brand-primary" size={18} />
              <h3 className="font-display font-bold text-brand-dark">Nutrition Facts <span className="text-xs font-normal text-brand-textSub">(Per 100g)</span></h3>
            </div>
            {product.nutritionFacts ? (
              <div className="space-y-2 text-xs">
                {Object.entries(product.nutritionFacts).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-brand-border/30">
                    <span className="text-brand-textSub capitalize">{key}</span>
                    <span className="font-semibold text-brand-dark">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs flex-grow flex flex-col justify-center">
                <div className="flex justify-between py-1.5 border-b border-brand-border/30">
                  <span className="text-brand-textSub">Energy</span>
                  <span className="font-semibold text-brand-dark">255 kcal</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/30">
                  <span className="text-brand-textSub">Protein</span>
                  <span className="font-semibold text-brand-dark">10.4 g</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/30">
                  <span className="text-brand-textSub">Carbohydrate</span>
                  <span className="font-semibold text-brand-dark">64.8 g</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border/30">
                  <span className="text-brand-textSub">Total Fat</span>
                  <span className="font-semibold text-brand-dark">3.3 g</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-brand-textSub">Fiber</span>
                  <span className="font-semibold text-brand-dark">26.5 g</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-brand-light/15 border border-brand-border/50 p-6 rounded-2xl flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-brand-primary" size={18} />
              <h3 className="font-display font-bold text-brand-dark">Why Choose Affora?</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <span className="font-semibold text-brand-dark block">Premium Quality</span>
                  <span className="text-brand-textSub text-[11px]">Strict standards</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <span className="font-semibold text-brand-dark block">100% Natural</span>
                  <span className="text-brand-textSub text-[11px]">Pure ingredients</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <span className="font-semibold text-brand-dark block">Trusted by Thousands</span>
                  <span className="text-brand-textSub text-[11px]">Happy customers</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={12} />
                </div>
                <div>
                  <span className="font-semibold text-brand-dark block">Fast & Secure</span>
                  <span className="text-brand-textSub text-[11px]">Safe delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-brand-border/60 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-dark">Customer Reviews</h2>
            <button 
              onClick={() => {
                const elem = document.getElementById('write-review-section');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1"
            >
              See All Reviews <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            
            <div className="bg-brand-light/20 border border-brand-border/50 p-6 rounded-2xl flex flex-col justify-center">
              <div className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-1">{averageRating}</div>
              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={14} 
                    fill={star <= Math.round(Number(averageRating)) ? "currentColor" : "none"} 
                  />
                ))}
              </div>
              <p className="text-xs text-brand-textSub mb-4">Based on {reviews.length || product.numReviews || 0} reviews</p>
              
              <div className="space-y-1.5 w-full text-xs">
                {[5, 4, 3, 2, 1].map(stars => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-3 text-brand-textSub">{stars}</span>
                    <Star className="text-yellow-500 fill-yellow-500" size={10} />
                    <div className="flex-1 h-2 bg-brand-border/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-primary rounded-full" 
                        style={{ width: `${ratingDistribution[stars] || 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-brand-textSub">{ratingDistribution[stars] || 0}%</span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => {
                const reviewerName = review.user?.name || 'Customer';
                const initial = reviewerName.charAt(0).toUpperCase();
                return (
                  <div key={review._id} className="bg-white border border-brand-border/60 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-brand-dark text-sm">{reviewerName}</p>
                            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Verified Buyer</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={12} 
                            fill={star <= review.rating ? "currentColor" : "none"} 
                          />
                        ))}
                      </div>
                      <h4 className="font-bold text-brand-dark text-sm mb-1">{review.title}</h4>
                      <p className="text-brand-textSub text-xs leading-relaxed line-clamp-3">{review.comment}</p>
                    </div>
                    {review.image && (
                      <div className="mt-4 w-12 h-12 rounded-lg overflow-hidden border border-brand-border/40">
                        <img src={review.image} alt="Review attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-3 bg-white border border-brand-border/60 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                <p className="text-brand-textSub text-sm">No reviews submitted yet. Be the first customer to share your experience!</p>
              </div>
            )}

          </div>

          <div id="write-review-section" className="bg-brand-light/10 border border-brand-border/50 p-6 md:p-8 rounded-3xl">
            <h3 className="text-xl font-display font-bold text-brand-dark mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="max-w-2xl">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-brand-dark mb-2">Rating</label>
                  <div className="flex gap-2 text-yellow-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className="hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={24} 
                          fill={star <= reviewForm.rating ? "currentColor" : "none"} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Title</label>
                  <input 
                    required 
                    type="text" 
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-primary" 
                    placeholder="Summary of your experience"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-brand-dark mb-1">Comment</label>
                  <textarea 
                    required 
                    rows="4" 
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-primary"
                    placeholder="Share details of your own experience with this product"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 px-8 rounded-xl shadow-sm transition-all text-sm disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border/40">
                <p className="text-brand-textSub text-sm">Please log in to your account to write and submit a review.</p>
                <Link href="/login">
                  <button className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-all">
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-brand-border/60 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-dark">You May Also Like</h2>
              <Link className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1" href="/products">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map(relatedProduct => (
                <div key={relatedProduct._id} className="transform scale-95 hover:scale-100 transition-transform">
                  <ProductCard product={relatedProduct} />
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}