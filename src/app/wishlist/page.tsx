'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner, { FullPageLoader } from '../../components/LoadingSpinner';

interface Product {
  _id: string;
  name: string;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  description: string;
}

interface Wishlist {
  _id: string;
  products: Product[];
}

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchWishlist();
    }
  }, [user, loading, router]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const data = await response.json();
      
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setUpdating(false);
    }
  };

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your wishlist?')) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/wishlist?clearAll=true', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setWishlist(null);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    } finally {
      setUpdating(false);
    }
  };

  const addToCart = async (product: Product) => {
    // For now, we'll add with default size and color
    // In a real app, you might want to show a modal to select size/color
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          size: 'M', // Default size
          color: 'Default', // Default color
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Item added to cart!');
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading || wishlistLoading) {
    return <FullPageLoader />;
  }

  if (!wishlist || wishlist.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Save items you love to buy them later!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist ({wishlist.products.length} items)</h1>
          <button
            onClick={clearWishlist}
            disabled={updating}
            className="text-black hover:text-gray-600 font-medium disabled:opacity-50 flex items-center"
          >
            {updating && <LoadingSpinner size="small" className="mr-2" />}
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square">
                <Image
                  src={product.image || '/placeholder.jpg'}
                  alt={`${product.name} - Wishlist item - ${product.category} - $${product.price}`}
                  fill
                  className="object-cover"
                  onError={() => console.log(`Failed to load wishlist item image: ${product.image}`)}
                />
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  disabled={updating}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-600 hover:text-red-700 disabled:opacity-50"
                  title="Remove from wishlist"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category} • {product.subcategory}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={updating}
                    className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {updating && <LoadingSpinner size="small" className="mr-2" />}
                    Add to Cart
                  </button>
                  <button
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="w-full border border-black text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-white border border-black text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
