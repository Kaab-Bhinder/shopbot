'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const WomenPage = () => {
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [overlayText, setOverlayText] = useState<string>('');
  const { products, loading, error } = useProducts({ 
    sex: 'Women',
    category: selectedCategory,
    limit: 20 
  });

  useEffect(() => {
    // Fetch categories for women
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        // Filter categories for women
        setCategories(data.filter((cat: { sex: string }) => cat.sex === 'Women' || cat.sex === 'Unisex'));
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const cat = categories.find(c => c._id === selectedCategory);
      setOverlayText(cat ? cat.name : '');
    } else {
      setOverlayText('');
    }
  }, [selectedCategory, categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Women&apos;s Collection</h1>
            <p className="text-lg text-gray-600">Discover our latest women&apos;s fashion</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Women&apos;s Collection</h1>
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Women&apos;s Collection</h1>
            <p className="text-gray-600">No women&apos;s products available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image with Overlay */}
        <div className="relative mb-8">
          <div className="relative w-full h-72 rounded-lg overflow-hidden">
            <Image 
              src="/banner-2.jpg" 
              alt="Women&apos;s Collection" 
              fill
              className="object-cover"
            />
          </div>
          {overlayText && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black bg-opacity-60 text-white text-3xl font-bold px-6 py-2 rounded-lg">{overlayText}</span>
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="mb-8 flex justify-center">
          <select
            className="border border-gray-300 rounded px-4 py-2 text-lg"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Women&apos;s Products Found</h3>
            <p className="text-gray-600">Check back later for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WomenPage;


