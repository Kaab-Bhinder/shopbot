'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner, { FullPageLoader } from '../../components/LoadingSpinner';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    image: string;
    images?: string[];
    price: number;
  };
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  total: number;
}

export default function CartPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchCart();
    }
  }, [user, loading, router]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setCartLoading(false);
    }
  };

  const updateQuantity = async (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          size,
          color,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId: string, size: string, color: string) => {
    setUpdating(true);
    try {
      const params = new URLSearchParams({
        productId,
        size,
        color,
      });
      
      const response = await fetch(`/api/cart?${params.toString()}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    setUpdating(true);
    try {
      const response = await fetch('/api/cart?clearAll=true', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCart(null);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || cartLoading) {
    return <FullPageLoader />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            <button
              onClick={() => router.push('/')}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            disabled={updating}
            className="text-black hover:text-gray-600 font-medium disabled:opacity-50 flex items-center"
          >
            {updating && <LoadingSpinner size="small" className="mr-2" />}
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {cart.items.map((item) => (
            <div key={`${item.product._id}-${item.size}-${item.color}`} className="border-b border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.product.image || '/placeholder.jpg'}
                    alt={`${item.product.name} - Size: ${item.size}, Color: ${item.color} - $${item.product.price}`}
                    fill
                    className="object-cover rounded-lg"
                    onError={() => console.log(`Failed to load cart item image: ${item.product.image}`)}
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>Size: {item.size}</span>
                    <span className="mx-2">•</span>
                    <span>Color: {item.color}</span>
                  </div>
                  <div className="text-lg font-medium text-gray-900 mt-2">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity - 1)}
                    disabled={updating || item.quantity <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.size, item.color, item.quantity + 1)}
                    disabled={updating}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                <div className="text-lg font-bold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => removeItem(item.product._id, item.size, item.color)}
                  disabled={updating}
                  className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                  title="Remove item"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          <div className="p-6">
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6">
              <span>Total: ${cart.total.toFixed(2)}</span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-white text-black border border-black py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => router.push('/checkout')}
                disabled={updating}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {updating && <LoadingSpinner size="small" className="mr-2" />}
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
