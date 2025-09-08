'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import LoadingSpinner, { FullPageLoader } from '../../../components/LoadingSpinner';

interface Review {
  _id: string;
  user?: { fullname?: string; name?: string };
  rating: number;
  comment: string;
  createdAt?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  colors: string[];
  material?: string;
  care?: string;
  isOnSale: boolean;
  discountPercentage?: number;
  rating: number;
  numReviews: number;
  stock: number;
  tags: string[];
  specifications?: Map<string, string>;
}

export default function ProductDetailPage() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  // Review state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          if (data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
          if (data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0]);
          }
        } else {
          setError(data.error || 'Failed to fetch product');
        }
      } catch {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${params.id}`);
        const data = await response.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch {
        setReviews([]);
      }
    };
    if (params.id) {
      fetchProduct();
      fetchReviews();
    }
  }, [params.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setReviewError('Please log in to post a review');
      return;
    }
    
    setReviewLoading(true);
    setReviewError('');
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: params.id,
          rating: reviewRating,
          comment: reviewText
        })
      });
      const data = await response.json();
      
      if (data.success && data.review) {
        // Add new review to the list
        setReviews([data.review, ...reviews]);
        setReviewText('');
        setReviewRating(5);
        
        // Update product rating and review count
        if (product) {
          const newReviewCount = product.numReviews + 1;
          const newRating = ((product.rating * product.numReviews) + reviewRating) / newReviewCount;
          setProduct({
            ...product,
            rating: Math.round(newRating * 10) / 10,
            numReviews: newReviewCount
          });
        }
      } else {
        setReviewError(data.error || 'Failed to post review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      setReviewError('Failed to post review');
    } finally {
      setReviewLoading(false);
    }
  };

  const discountedPrice = product?.isOnSale && product.discountPercentage 
  ? parseFloat((product.price ?? '0').replace(/[^0-9.]/g, '')) - (parseFloat((product.price ?? '0').replace(/[^0-9.]/g, '')) * (product.discountPercentage ?? 0) / 100)
  : parseFloat((product?.price ?? '0').replace(/[^0-9.]/g, ''));

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    setAddingToCart(true);
    try {
      const success = await addToCart(
        product?._id || '',
        quantity,
        selectedSize,
        selectedColor
      );

      if (success) {
        alert('Item added to cart!');
      } else {
        alert('Item is already in cart with this size and color, or failed to add');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    setAddingToWishlist(true);
    try {
      const success = await addToWishlist(product?._id || '');
      if (success) {
        alert('Item added to wishlist!');
      } else {
        alert('Item is already in wishlist or failed to add');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleTryOn = () => {
    // TODO: Implement try on functionality
    console.log('Try on:', product?._id);
  };

  if (loading) {
    return <FullPageLoader />;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Removed pagination/breadcrumb navigation as requested */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <Image
                src={(product?.images && product.images[currentImageIndex]) || product?.image || '/default.jpg'}
                alt={product?.name ? `${product.name} - Product image ${currentImageIndex + 1} - $${product.price}` : 'Product image'}
                fill
                className="object-cover"
                onError={() => console.log(`Failed to load product image: ${(product?.images && product.images[currentImageIndex]) || product?.image}`)}
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product?.isOnSale && product?.discountPercentage && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product?.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-gray-900' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product?.name} - Thumbnail ${index + 1} of ${product.images.length}`}
                      fill
                      className="object-cover"
                      onError={() => console.log(`Failed to load thumbnail image: ${image}`)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product?.name}</h1>
            </div>
            <div className="flex items-center">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">{'★'.repeat(Math.round(product?.rating ?? 0))}{'☆'.repeat(5-Math.round(product?.rating ?? 0))}</span>
                <span className="text-sm text-gray-600">({product?.numReviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Price / Discounted Price */}
              <span className="text-2xl font-bold text-gray-900">
                ${discountedPrice.toFixed(2)}
              </span>
              {product?.isOnSale && product?.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${parseFloat(product.originalPrice.toString()).toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-gray-600 leading-relaxed">{product?.description}</p>
            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {product?.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex gap-2">
                {product?.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`py-2 px-4 text-sm font-medium rounded-md border transition-colors ${
                      selectedColor === color
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >-
                </button>
                <span className="flex-1 text-center py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900"
                >+
                </button>
              </div>
            </div>
            {/* Stock Status */}
            <div className="text-sm">
              <span className={`font-medium ${(product?.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(product?.stock ?? 0) > 0 ? `In Stock (${product?.stock ?? 0} available)` : 'Out of Stock'}
              </span>
            </div>
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product?.stock === 0 || addingToCart}
                className="w-full bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {addingToCart && <LoadingSpinner size="small" className="mr-2" />}
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              {/* <Link
                href={`/try-on/${product?._id}`}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white py-3 px-6 rounded-md font-medium hover:from-gray-700 hover:to-gray-900 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center space-x-2"
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
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>✨ Virtual Try On</span>
              </Link> */}
              <button
                onClick={handleAddToWishlist}
                disabled={product?.stock === 0 || addingToWishlist}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {addingToWishlist && <LoadingSpinner size="small" className="mr-2" />}
                {addingToWishlist ? 'Adding...' : 'Add to Wishlist'}
              </button>
            </div>
            {/* Additional Info */}
            {product?.material && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Material</h3>
                <p className="text-gray-600">{product.material}</p>
              </div>
            )}
            {product?.care && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Care Instructions</h3>
                <p className="text-gray-600">{product.care}</p>
              </div>
            )}
            {product?.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Review Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          
          {user ? (
            <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-gray-100 rounded-lg">
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Your Review</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={reviewRating}
                  onChange={e => setReviewRating(Number(e.target.value))}
                  required
                >
                  {[5,4,3,2,1].map(r => (
                    <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={reviewLoading}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition-colors"
              >{reviewLoading ? 'Posting...' : 'Post Review'}</button>
              {reviewError && <p className="text-red-600 mt-2">{reviewError}</p>}
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600 mb-4">Please log in to post a review</p>
              <Link href="/login" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition-colors">
                Log In
              </Link>
            </div>
          )}
          <div className="space-y-6">
            {reviews.length === 0 && <p className="text-gray-600">No reviews yet.</p>}
            {reviews.map((review: Review) => (
              <div key={review._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 mr-2">{review.user?.fullname || review.user?.name || 'Anonymous User'}</span>
                    <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                  </div>
                  {review.createdAt && (
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
