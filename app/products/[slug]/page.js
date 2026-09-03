'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ArrowRight,
} from 'lucide-react';

import ProductCard from '../../../components/ui/ProductCard';
import { productApi } from '../../../services/productApi';
import { userApi } from '../../../services/userApi';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export default function ProductDetailsPage({ params }) {
  const router = useRouter();

  const { toast } = useToast();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('Description');

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  const [submittingReview, setSubmittingReview] = useState(false);

  /* =========================================================
     FETCH PRODUCT
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const resolvedParams = await params;
        const slug = resolvedParams?.slug;

        if (!slug) {
          throw new Error('Product slug is missing');
        }

        const response = await productApi.getBySlug(slug);

        /*
          Supports these possible API structures:

          1.
          {
            success: true,
            data: {
              product: {...},
              related: [],
              reviews: []
            }
          }

          2.
          {
            product: {...},
            related: [],
            reviews: []
          }

          3.
          {
            data: {
              product: {...}
            }
          }
        */

        const root = response || {};

        const data =
          root?.data?.product
            ? root.data
            : root?.product
              ? root
              : root?.data?.data?.product
                ? root.data.data
                : null;

        const fetchedProduct =
          data?.product ||
          root?.product ||
          null;

        if (!fetchedProduct) {
          throw new Error('Product not found');
        }

        const fetchedRelated = Array.isArray(data?.related)
          ? data.related
          : Array.isArray(root?.related)
            ? root.related
            : [];

        const fetchedReviews = Array.isArray(data?.reviews)
          ? data.reviews
          : Array.isArray(root?.reviews)
            ? root.reviews
            : [];

        if (!mounted) return;

        setProduct(fetchedProduct);
        setRelatedProducts(fetchedRelated);
        setReviews(fetchedReviews);

        const weights = Array.isArray(fetchedProduct.weightOptions)
          ? fetchedProduct.weightOptions
          : [];

        if (weights.length > 0 && weights[0]?.weight) {
          setSelectedWeight(String(weights[0].weight));
        } else {
          setSelectedWeight(
            fetchedProduct.weight
              ? String(fetchedProduct.weight)
              : '100g'
          );
        }

        setActiveImage(0);
        setQuantity(1);
      } catch (error) {
        console.error('Product Details Error:', error);

        if (!mounted) return;

        setProduct(null);
        setRelatedProducts([]);
        setReviews([]);

        setErrorMessage(
          error?.message || 'Unable to load this product.'
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [params]);

  /* =========================================================
     SAFE PRODUCT DATA
  ========================================================= */

  const imagesList = useMemo(() => {
    if (!product || !Array.isArray(product.images)) {
      return [];
    }

    return product.images
      .map((image) => {
        if (typeof image === 'string') {
          return image;
        }

        if (image && typeof image === 'object') {
          return image.url || image.secure_url || '';
        }

        return '';
      })
      .filter(Boolean);
  }, [product]);

  const weightOptions = useMemo(() => {
    if (!product || !Array.isArray(product.weightOptions)) {
      return [];
    }

    return product.weightOptions.filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        item.weight
    );
  }, [product]);

  /* =========================================================
     CATEGORY
  ========================================================= */

  const categoryName = useMemo(() => {
    if (!product) return 'Spices';

    if (
      product.category &&
      typeof product.category === 'object'
    ) {
      return (
        product.category.name ||
        product.categoryName ||
        'Spices'
      );
    }

    return (
      product.categoryName ||
      product.category ||
      'Spices'
    );
  }, [product]);

  /* =========================================================
     CURRENT PRICE
  ========================================================= */

  const selectedVariant = useMemo(() => {
    if (!weightOptions.length) {
      return null;
    }

    return (
      weightOptions.find(
        (item) =>
          String(item.weight) === String(selectedWeight)
      ) || weightOptions[0]
    );
  }, [weightOptions, selectedWeight]);

  const currentPrice = useMemo(() => {
    const variantPrice = Number(
      selectedVariant?.price
    );

    const productPrice = Number(product?.price);

    if (
      Number.isFinite(variantPrice) &&
      variantPrice >= 0
    ) {
      return variantPrice;
    }

    if (
      Number.isFinite(productPrice) &&
      productPrice >= 0
    ) {
      return productPrice;
    }

    return 0;
  }, [selectedVariant, product]);

  /* =========================================================
     COMPARE PRICE
  ========================================================= */

  const currentComparePrice = useMemo(() => {
    const variantComparePrice = Number(
      selectedVariant?.comparePrice
    );

    const productComparePrice = Number(
      product?.comparePrice
    );

    if (
      Number.isFinite(variantComparePrice) &&
      variantComparePrice > 0
    ) {
      return variantComparePrice;
    }

    if (
      Number.isFinite(productComparePrice) &&
      productComparePrice > 0
    ) {
      return productComparePrice;
    }

    return 0;
  }, [selectedVariant, product]);

  /* =========================================================
     DISCOUNT
  ========================================================= */

  const discountPercentage = useMemo(() => {
    if (
      currentComparePrice > currentPrice &&
      currentComparePrice > 0
    ) {
      return Math.round(
        ((currentComparePrice - currentPrice) /
          currentComparePrice) *
          100
      );
    }

    return 0;
  }, [currentPrice, currentComparePrice]);

  /* =========================================================
     RATING DISTRIBUTION
  ========================================================= */

  const ratingDistribution = useMemo(() => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    if (!Array.isArray(reviews)) {
      return distribution;
    }

    reviews.forEach((review) => {
      const rating = Math.round(
        Number(review?.rating || 0)
      );

      if (
        rating >= 1 &&
        rating <= 5 &&
        distribution[rating] !== undefined
      ) {
        distribution[rating] += 1;
      }
    });

    const total = reviews.length;

    if (!total) {
      return distribution;
    }

    Object.keys(distribution).forEach((key) => {
      distribution[key] = Math.round(
        (distribution[key] / total) * 100
      );
    });

    return distribution;
  }, [reviews]);

  /* =========================================================
     AVERAGE RATING
  ========================================================= */

  const averageRating = useMemo(() => {
    if (
      !Array.isArray(reviews) ||
      reviews.length === 0
    ) {
      return Number(product?.rating || 4.5).toFixed(1);
    }

    const validReviews = reviews.filter(
      (review) =>
        Number.isFinite(Number(review?.rating))
    );

    if (!validReviews.length) {
      return Number(product?.rating || 4.5).toFixed(1);
    }

    const total = validReviews.reduce(
      (sum, review) =>
        sum + Number(review.rating),
      0
    );

    return (total / validReviews.length).toFixed(1);
  }, [reviews, product]);

  /* =========================================================
     STOCK
  ========================================================= */

  const stock = Number(product?.stock ?? 0);

  const isOutOfStock = stock <= 0;

  /* =========================================================
     QUANTITY
  ========================================================= */

  const increaseQuantity = () => {
    setQuantity((current) => {
      const maxStock = stock > 0 ? stock : 100;

      if (current >= maxStock) {
        return current;
      }

      return current + 1;
    });
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  /* =========================================================
     IMAGE NAVIGATION
  ========================================================= */

  const nextImage = () => {
    if (imagesList.length <= 1) return;

    setActiveImage(
      (current) =>
        (current + 1) % imagesList.length
    );
  };

  const prevImage = () => {
    if (imagesList.length <= 1) return;

    setActiveImage(
      (current) =>
        (current - 1 + imagesList.length) %
        imagesList.length
    );
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const handleAddToCart = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    try {
      await addToCart(
        product,
        quantity,
        selectedWeight
      );

      toast.success('Product added to cart');

      router.push('/cart');
    } catch (error) {
      console.error('Add to cart error:', error);

      toast.error(
        error?.message ||
          'Unable to add product to cart.'
      );
    }
  };

  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow = async () => {
    if (!product) return;

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    try {
      await addToCart(
        product,
        quantity,
        selectedWeight
      );

      router.push('/checkout');
    } catch (error) {
      console.error('Buy now error:', error);

      toast.error(
        error?.message ||
          'Unable to continue to checkout.'
      );
    }
  };

  /* =========================================================
     REVIEW SUBMIT
  ========================================================= */

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      toast.error(
        'Please login to write a review.'
      );
      return;
    }

    if (!product?._id) {
      toast.error(
        'Product information is unavailable.'
      );
      return;
    }

    if (!reviewForm.title.trim()) {
      toast.error('Please enter a review title.');
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.error('Please enter your review.');
      return;
    }

    try {
      setSubmittingReview(true);

      await userApi.createReview({
        productId: product._id,
        rating: Number(reviewForm.rating),
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
      });

      toast.success(
        'Review submitted successfully! It will be visible after approval.'
      );

      setReviewForm({
        rating: 5,
        title: '',
        comment: '',
      });
    } catch (error) {
      console.error(
        'Review submission error:',
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Failed to submit review.'
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-border border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-brand-textSub">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR / NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center bg-white border border-brand-border rounded-3xl p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
            <Search size={28} />
          </div>

          <h1 className="text-2xl font-display font-bold text-brand-dark mb-2">
            Product Not Found
          </h1>

          <p className="text-sm text-brand-textSub mb-6">
            {errorMessage ||
              'This product could not be loaded.'}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-brand-border text-sm font-medium"
            >
              Go Back
            </button>

            <Link
              href="/products"
              className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-medium"
            >
              View Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     SAFE PRODUCT VALUES
  ========================================================= */

  const productName =
    product.name || 'AFFORA Product';

  const productDescription =
    product.description ||
    "Handpicked from premium farms and carefully packed to preserve natural flavor, aroma and quality.";

  const productSubtitle =
    product.subtitle ||
    product.tagline ||
    "Pure flavor, pure aroma — straight from nature's finest farms.";

  const productIngredients =
    product.ingredients ||
    'Pure farm-fresh ingredients sourced directly from trusted farms.';

  const reviewCount =
    Array.isArray(reviews) && reviews.length > 0
      ? reviews.length
      : Number(product.numReviews || 0);

  return (
    <main className="bg-brand-bg min-h-screen py-6 md:py-12 px-2 sm:px-4 md:px-6">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-10 relative">

        {/* =====================================================
            PRODUCT TOP
        ====================================================== */}

        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* PRODUCT IMAGES */}

          <div className="md:col-span-5 flex flex-col gap-4">

            <div className="aspect-square bg-brand-light/40 rounded-2xl md:rounded-3xl flex items-center justify-center relative overflow-hidden border border-brand-border/30 group">

              {imagesList.length > 0 ? (
                <img
                  src={
                    imagesList[
                      Math.min(
                        activeImage,
                        imagesList.length - 1
                      )
                    ]
                  }
                  alt={productName}
                  className="object-cover w-full h-full transition-all duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-brand-textSub/40">
                  <Leaf size={60} />
                  <span className="font-display text-2xl font-bold mt-3">
                    AFFORA
                  </span>
                </div>
              )}

              {imagesList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark p-2.5 rounded-full shadow-sm transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-brand-dark p-2.5 rounded-full shadow-sm transition-all opacity-80 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {imagesList.length > 0 && (
                <button
                  type="button"
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white backdrop-blur p-2.5 rounded-full text-brand-textMain shadow-sm"
                  aria-label="View image"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* THUMBNAILS */}

            {imagesList.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {imagesList.slice(0, 8).map(
                  (imageUrl, index) => (
                    <button
                      type="button"
                      key={`${imageUrl}-${index}`}
                      onClick={() =>
                        setActiveImage(index)
                      }
                      className={`flex-shrink-0 w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === index
                          ? 'border-brand-primary ring-2 ring-brand-primary/20'
                          : 'border-brand-border/60 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${productName} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}

          <div className="md:col-span-7 flex flex-col">

            {/* BREADCRUMB */}

            <div className="flex text-xs md:text-sm text-brand-textSub mb-2 gap-2 items-center">
              <Link
                className="hover:text-brand-primary"
                href="/"
              >
                Home
              </Link>

              <span>/</span>

              <Link
                className="hover:text-brand-primary"
                href="/products"
              >
                Products
              </Link>

              <span>/</span>

              <span className="text-brand-textMain font-medium truncate">
                {categoryName}
              </span>
            </div>

            {/* NAME */}

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-brand-dark mb-2">
              {productName}
            </h1>

            {/* SUBTITLE */}

            <p className="text-sm md:text-base text-brand-textSub mb-4">
              {productSubtitle}
            </p>

            {/* RATING */}

            <div className="flex flex-wrap items-center gap-3 mb-5 pb-4 border-b border-brand-border/60">

              <div className="flex items-center gap-1 text-yellow-500">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={16}
                      fill={
                        star <=
                        Math.round(
                          Number(averageRating)
                        )
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  )
                )}
              </div>

              <span className="text-sm font-semibold text-brand-textMain">
                {averageRating}
              </span>

              <span className="text-sm text-brand-textSub">
                ({reviewCount} reviews)
              </span>

              <span className="mx-2 text-brand-border">
                •
              </span>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  !isOutOfStock
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {!isOutOfStock
                  ? 'In Stock'
                  : 'Out of Stock'}
              </span>
            </div>

            {/* PRICE */}

            <div className="flex flex-wrap items-baseline gap-3 mb-6">

              <span className="text-3xl md:text-4xl font-display font-bold text-brand-dark">
                ₹{currentPrice}
              </span>

              {currentComparePrice >
                currentPrice && (
                <span className="text-base md:text-lg text-brand-textSub line-through">
                  ₹{currentComparePrice}
                </span>
              )}

              {discountPercentage > 0 && (
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* BENEFITS */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 py-3 border-y border-brand-border/40 text-xs">

              <Benefit
                icon={<Leaf size={14} />}
                title="100% Pure & Natural"
              />

              <Benefit
                icon={<ShieldCheck size={14} />}
                title="No Added Preservatives"
              />

              <Benefit
                icon={<Globe size={14} />}
                title="Sourced from Local Farms"
              />

              <Benefit
                icon={<Award size={14} />}
                title="Export Quality"
              />
            </div>

            {/* WEIGHT */}

            {weightOptions.length > 0 && (
              <div className="mb-6">

                <h3 className="text-xs font-bold text-brand-dark mb-2 uppercase tracking-wider">
                  Select Weight
                </h3>

                <div className="flex flex-wrap gap-2">

                  {weightOptions.map(
                    (variant, index) => {
                      const weight = String(
                        variant.weight
                      );

                      return (
                        <button
                          type="button"
                          key={`${weight}-${index}`}
                          onClick={() =>
                            setSelectedWeight(
                              weight
                            )
                          }
                          className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
                            selectedWeight === weight
                              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold'
                              : 'border-brand-border text-brand-textSub hover:border-brand-textSub bg-white'
                          }`}
                        >
                          {weight}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* QUANTITY */}

            <div className="flex items-center gap-4 mb-6">

              <div className="flex items-center justify-between border border-brand-border rounded-xl px-3 py-1.5 w-32 bg-white">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="text-brand-textSub hover:text-brand-primary p-1"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="font-semibold text-brand-dark text-sm">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    stock > 0 &&
                    quantity >= stock
                  }
                  className="text-brand-textSub hover:text-brand-primary p-1 disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>

              </div>

              {stock > 0 && (
                <span className="text-xs text-brand-textSub">
                  {stock} available
                </span>
              )}
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>

                {isOutOfStock
                  ? 'Out of Stock'
                  : 'Add to Cart'}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5 font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    'Wishlist functionality is available from your account.'
                  )
                }
                className="w-full sm:w-12 h-12 border border-brand-border hover:border-brand-primary rounded-xl flex items-center justify-center text-brand-textSub hover:text-red-500 transition-colors bg-white flex-shrink-0"
                aria-label="Add to Wishlist"
              >
                <Heart size={20} />
              </button>

            </div>
          </div>
        </section>

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="mt-12 border-b border-brand-border flex gap-8 overflow-x-auto scrollbar-hide text-sm font-medium">

          {[
            'Description',
            'Features',
            'Ingredients',
            'Reviews',
            'Shipping & Returns',
          ].map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() =>
                setActiveTab(tab)
              }
              className={`pb-3 whitespace-nowrap transition-colors relative ${
                activeTab === tab
                  ? 'text-brand-dark font-semibold'
                  : 'text-brand-textSub hover:text-brand-dark'
              }`}
            >
              {tab}

              {tab === 'Reviews' &&
                reviewCount > 0 && (
                  <span className="ml-1">
                    ({reviewCount})
                  </span>
                )}

              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          ))}
        </div>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}

        {activeTab === 'Description' && (
          <section className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-7">

              <h2 className="text-xl md:text-2xl font-display font-bold text-brand-dark mb-4">
                Product Description
              </h2>

              <p className="text-brand-textSub leading-relaxed text-sm md:text-base">
                {productDescription}
              </p>

              <div className="flex flex-col gap-2 mt-5">

                <FeatureItem text="Rich in antioxidants and essential nutrients" />

                <FeatureItem text="Enhances authentic flavor in every single dish" />

                <FeatureItem text="Supports healthy digestion and natural wellness" />

              </div>
            </div>

            <PromoImage
              image={imagesList[0]}
            />
          </section>
        )}

        {/* =====================================================
            FEATURES
        ====================================================== */}

        {activeTab === 'Features' && (
          <section className="mt-10">

            <h2 className="text-xl md:text-2xl font-display font-bold text-brand-dark mb-6">
              Key Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

              <FeatureCard
                icon={<Leaf size={20} />}
                title="100% Natural"
                text="No artificial colors or flavors"
              />

              <FeatureCard
                icon={<Award size={20} />}
                title="Premium Quality"
                text="Handpicked & carefully graded"
              />

              <FeatureCard
                icon={<SparklesIcon />}
                title="Rich Aroma"
                text="Intense flavor in every grain"
              />

              <FeatureCard
                icon={<Truck size={20} />}
                title="Farm Fresh"
                text="Sourced from trusted farmers"
              />

              <FeatureCard
                icon={<Globe size={20} />}
                title="Sustainable"
                text="Supports local communities"
              />

            </div>
          </section>
        )}

        {/* =====================================================
            INGREDIENTS
        ====================================================== */}

        {activeTab === 'Ingredients' && (
          <section className="mt-10">

            <div className="bg-brand-light/15 border border-brand-border/50 p-6 rounded-2xl">

              <div className="flex items-center gap-2 mb-4">
                <Leaf
                  className="text-brand-primary"
                  size={18}
                />

                <h2 className="font-display font-bold text-brand-dark">
                  Ingredients
                </h2>
              </div>

              <div className="flex items-center gap-4">

                {imagesList[0] && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-brand-light flex-shrink-0 border border-brand-border/30">
                    <img
                      src={imagesList[0]}
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-brand-dark text-sm mb-1">
                    {productName}
                  </h3>

                  <p className="text-sm text-brand-textSub leading-relaxed">
                    {productIngredients}
                  </p>
                </div>

              </div>
            </div>

            {/* NUTRITION */}

            <div className="mt-6 bg-brand-light/15 border border-brand-border/50 p-6 rounded-2xl">

              <div className="flex items-center gap-2 mb-4">

                <ShieldCheck
                  className="text-brand-primary"
                  size={18}
                />

                <h2 className="font-display font-bold text-brand-dark">
                  Nutrition Facts
                  <span className="text-xs font-normal text-brand-textSub ml-1">
                    (Per 100g)
                  </span>
                </h2>

              </div>

              {product.nutritionFacts &&
              typeof product.nutritionFacts ===
                'object' ? (
                <div className="space-y-2 text-xs">

                  {Object.entries(
                    product.nutritionFacts
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b border-brand-border/30"
                    >
                      <span className="text-brand-textSub capitalize">
                        {key}
                      </span>

                      <span className="font-semibold text-brand-dark">
                        {String(value)}
                      </span>
                    </div>
                  ))}

                </div>
              ) : (
                <p className="text-sm text-brand-textSub">
                  Nutrition information is not available.
                </p>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            REVIEWS
        ====================================================== */}

        {activeTab === 'Reviews' && (
          <section className="mt-10">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

              <div className="bg-brand-light/20 border border-brand-border/50 p-6 rounded-2xl">

                <div className="text-4xl font-display font-bold text-brand-dark mb-1">
                  {averageRating}
                </div>

                <div className="flex items-center gap-1 text-yellow-500 mb-2">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={
                          star <=
                          Math.round(
                            Number(
                              averageRating
                            )
                          )
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    )
                  )}

                </div>

                <p className="text-xs text-brand-textSub mb-4">
                  Based on {reviewCount} reviews
                </p>

                <div className="space-y-2">

                  {[5, 4, 3, 2, 1].map(
                    (stars) => (
                      <div
                        key={stars}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="w-3">
                          {stars}
                        </span>

                        <Star
                          className="text-yellow-500 fill-yellow-500"
                          size={10}
                        />

                        <div className="flex-1 h-2 bg-brand-border/40 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-primary rounded-full"
                            style={{
                              width: `${
                                ratingDistribution[
                                  stars
                                ] || 0
                              }%`,
                            }}
                          />
                        </div>

                        <span className="w-8 text-right text-brand-textSub">
                          {ratingDistribution[
                            stars
                          ] || 0}
                          %
                        </span>
                      </div>
                    )
                  )}

                </div>
              </div>

              {reviews.length > 0 ? (
                reviews
                  .slice(0, 3)
                  .map((review, index) => {

                    const reviewerName =
                      review?.user?.name ||
                      review?.user?.fullName ||
                      'Customer';

                    const initial =
                      reviewerName
                        .charAt(0)
                        .toUpperCase();

                    return (
                      <div
                        key={
                          review?._id ||
                          review?.id ||
                          index
                        }
                        className="bg-white border border-brand-border/60 p-5 rounded-2xl flex flex-col justify-between shadow-sm"
                      >

                        <div>

                          <div className="flex items-center gap-3 mb-3">

                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-xs">
                              {initial}
                            </div>

                            <div>
                              <p className="font-semibold text-brand-dark text-sm">
                                {reviewerName}
                              </p>

                              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                                Verified Buyer
                              </span>
                            </div>

                          </div>

                          <div className="flex items-center gap-1 text-yellow-500 mb-2">

                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  fill={
                                    star <=
                                    Number(
                                      review?.rating ||
                                        0
                                    )
                                      ? 'currentColor'
                                      : 'none'
                                  }
                                />
                              )
                            )}

                          </div>

                          <h4 className="font-bold text-brand-dark text-sm mb-1">
                            {review?.title ||
                              'Customer Review'}
                          </h4>

                          <p className="text-brand-textSub text-xs leading-relaxed">
                            {review?.comment ||
                              'No review comment available.'}
                          </p>

                        </div>

                        {review?.image && (
                          <div className="mt-4 w-12 h-12 rounded-lg overflow-hidden border border-brand-border/40">
                            <img
                              src={review.image}
                              alt="Review attachment"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                      </div>
                    );
                  })
              ) : (
                <div className="md:col-span-3 bg-white border border-brand-border/60 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                  <p className="text-brand-textSub text-sm">
                    No reviews submitted yet.
                    Be the first customer to
                    share your experience!
                  </p>
                </div>
              )}

            </div>

            {/* WRITE REVIEW */}

            <div
              id="write-review-section"
              className="bg-brand-light/10 border border-brand-border/50 p-6 md:p-8 rounded-3xl"
            >

              <h3 className="text-xl font-display font-bold text-brand-dark mb-4">
                Write a Review
              </h3>

              {user ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="max-w-2xl"
                >

                  {/* RATING */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium text-brand-dark mb-2">
                      Rating
                    </label>

                    <div className="flex gap-2 text-yellow-500">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() =>
                              setReviewForm(
                                (current) => ({
                                  ...current,
                                  rating: star,
                                })
                              )
                            }
                            className="hover:scale-110 transition-transform"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              size={24}
                              fill={
                                star <=
                                reviewForm.rating
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />
                          </button>
                        )
                      )}

                    </div>
                  </div>

                  {/* TITLE */}

                  <div className="mb-4">

                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Title
                    </label>

                    <input
                      required
                      type="text"
                      value={reviewForm.title}
                      onChange={(event) =>
                        setReviewForm(
                          (current) => ({
                            ...current,
                            title:
                              event.target.value,
                          })
                        )
                      }
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-primary"
                      placeholder="Summary of your experience"
                    />

                  </div>

                  {/* COMMENT */}

                  <div className="mb-6">

                    <label className="block text-sm font-medium text-brand-dark mb-1">
                      Comment
                    </label>

                    <textarea
                      required
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(event) =>
                        setReviewForm(
                          (current) => ({
                            ...current,
                            comment:
                              event.target.value,
                          })
                        )
                      }
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-primary"
                      placeholder="Share details of your own experience with this product"
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-3 px-8 rounded-xl shadow-sm transition-all text-sm disabled:opacity-50"
                  >
                    {submittingReview
                      ? 'Submitting...'
                      : 'Submit Review'}
                  </button>

                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-brand-border/40">

                  <p className="text-brand-textSub text-sm">
                    Please log in to your account
                    to write and submit a review.
                  </p>

                  <Link
                    href="/login"
                    className="bg-brand-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-all"
                  >
                    Login
                  </Link>

                </div>
              )}

            </div>
          </section>
        )}

        {/* =====================================================
            SHIPPING
        ====================================================== */}

        {activeTab === 'Shipping & Returns' && (
          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

            <InfoCard
              icon={<Truck size={22} />}
              title="Fast Delivery"
              text="Your order will be carefully packed and delivered safely to your doorstep."
            />

            <InfoCard
              icon={<ShieldCheck size={22} />}
              title="Secure Packaging"
              text="Every product is packed carefully to preserve freshness and quality."
            />

            <InfoCard
              icon={<Heart size={22} />}
              title="Customer Support"
              text="Our support team is available to help you with your order."
            />

          </section>
        )}

        {/* =====================================================
            RELATED PRODUCTS
        ====================================================== */}

        {Array.isArray(relatedProducts) &&
          relatedProducts.length > 0 && (
            <section className="mt-20 border-t border-brand-border/60 pt-12">

              <div className="flex items-center justify-between mb-8">

                <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-dark">
                  You May Also Like
                </h2>

                <Link
                  className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1"
                  href="/products"
                >
                  View All
                  <ArrowRight size={14} />
                </Link>

              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                {relatedProducts
                  .filter(Boolean)
                  .slice(0, 5)
                  .map(
                    (relatedProduct, index) => (
                      <div
                        key={
                          relatedProduct?._id ||
                          relatedProduct?.id ||
                          relatedProduct?.slug ||
                          index
                        }
                        className="transform scale-95 hover:scale-100 transition-transform"
                      >
                        <ProductCard
                          product={relatedProduct}
                        />
                      </div>
                    )
                  )}

              </div>
            </section>
          )}
      </div>
    </main>
  );
}

/* =========================================================
   BENEFIT
========================================================= */

function Benefit({ icon, title }) {
  return (
    <div className="flex flex-col items-center text-center p-1">
      <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-1">
        {icon}
      </div>

      <span className="font-medium text-brand-dark leading-tight">
        {title}
      </span>
    </div>
  );
}

/* =========================================================
   FEATURE ITEM
========================================================= */

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-brand-dark font-medium">
      <div className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center flex-shrink-0">
        <Check size={12} />
      </div>

      <span>{text}</span>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-brand-light/20 border border-brand-border/40 p-5 rounded-2xl flex flex-col items-center text-center">
      <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
        {icon}
      </div>

      <h4 className="font-semibold text-brand-dark text-sm mb-1">
        {title}
      </h4>

      <p className="text-xs text-brand-textSub">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   PROMO IMAGE
========================================================= */

function PromoImage({ image }) {
  return (
    <div className="lg:col-span-5">
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-[4/3] flex items-center justify-center shadow-md bg-brand-dark">

        {image && (
          <img
            src={image}
            alt="AFFORA product"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">

          <span className="text-xs uppercase tracking-wider font-semibold text-brand-primary mb-1">
            Pure Quality
          </span>

          <h3 className="text-xl md:text-2xl font-display font-bold mb-1">
            Pure Spice. Real Goodness.
          </h3>

          <p className="text-xs text-gray-200">
            Nature's finest, for a healthier you.
          </p>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-brand-light/15 border border-brand-border/50 p-6 rounded-2xl">
      <div className="w-11 h-11 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="font-display font-bold text-brand-dark mb-2">
        {title}
      </h3>

      <p className="text-sm text-brand-textSub leading-relaxed">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   SPARKLES ICON
========================================================= */

function SparklesIcon(props) {
  return (
    <svg
      {...props}
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}