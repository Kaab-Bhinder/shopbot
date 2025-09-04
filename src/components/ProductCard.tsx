'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import LoadingSpinner from './LoadingSpinner';

interface Product {
  _id: string;
  name: string;
  price: string;
  image: string;
  sex: 'Men' | 'Women';
  category: { _id: string; name: string } | string;
  subcategory: { _id: string; name: string } | string;
  isFeatured?: boolean;
  isNew?: boolean;
  description?: string;
  originalPrice?: number;
  images?: string[];
  category_slug?: string;
  subcategory_slug?: string;
  isOnSale?: boolean;
  discountPercentage?: number;
  isNewArrival?: boolean;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  material?: string;
  care?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Use images array if available, otherwise fall back to single image
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image].filter(Boolean);
  const currentImage = displayImages[currentImageIndex] || '/placeholder.jpg';

  // Auto-rotate images every 5 seconds when hovered
  useEffect(() => {
    if (!isHovered || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, displayImages.length]);

  const handleImageClick = () => {
    if (displayImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === displayImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const success = await addToCart(
        product._id,
        1,
        product.sizes?.[0] || 'M', // Default size
        product.colors?.[0] || 'Default' // Default color
      );

      if (success) {
        alert('Item added to cart!');
      } else {
        alert('Item is already in cart or failed to add');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const success = await addToWishlist(product._id);
      if (success) {
        alert('Item added to wishlist!');
      } else {
        alert('Item is already in wishlist or failed to add');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-64 bg-gray-200">
        <Link href={`/product/${product._id}`}>
          <Image
            src={currentImage}
            alt={`${product.name} - ${product.sex} ${product.category} - $${product.price}`}
            fill
            className="object-cover cursor-pointer"
            onError={() => console.log(`Failed to load image: ${currentImage}`)}
            onClick={handleImageClick}
          />
        </Link>

        {/* Sex Badge */}
        <div className="absolute top-2 right-2 z-10">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.sex === 'Men'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-pink-100 text-pink-800'
            }`}
          >
            {product.sex}
          </span>
        </div>

        {/* Image Navigation Dots */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {displayImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Badges Row - Under Image */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex flex-wrap gap-2">
          {product.isFeatured && (
            <span className="px-2 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full">FEATURED</span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">NEW</span>
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.sex === 'Men' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
            {product.sex}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
            {typeof product.subcategory === 'object' ? product.subcategory.name : product.subcategory}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-blue-600 mb-3">{product.price}</p>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-2">
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || !product.stock}
            className="flex-1 bg-black text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAddingToCart && <LoadingSpinner size="small" className="mr-2" />}
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <button 
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            className="flex-1 bg-white text-black border border-black font-medium py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isAddingToWishlist && <LoadingSpinner size="small" className="mr-2" />}
            {isAddingToWishlist ? 'Adding...' : 'Wishlist'}
          </button>
        </div>

        {/* Try On Button */}
        <Link 
          href={`/try-on/${product._id}`}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:from-gray-700 hover:to-gray-900 transform hover:scale-105"
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
          <span>✨ Try On</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
