'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: string;
    image?: string;
    images?: string[];
  };
  quantity: number;
  size: string;
  color: string;
  price: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan'
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch cart items
        const cartResponse = await fetch('/api/cart');
        const cartData = await cartResponse.json();
        
        if (cartData.success && cartData.cart && cartData.cart.items && cartData.cart.items.length > 0) {
          setCartItems(cartData.cart.items);
        } else {
          // Redirect to cart if empty
          router.push('/cart');
          return;
        }

        // Fetch saved shipping address
        const addressResponse = await fetch('/api/users/shipping-address');
        const addressData = await addressResponse.json();
        
        if (addressData.success && addressData.shippingAddress) {
          setShippingAddress(addressData.shippingAddress);
        } else if (addressData.userInfo) {
          // Pre-populate with user info if no saved address
          setShippingAddress(prev => ({
            ...prev,
            fullName: addressData.userInfo.fullname || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'postalCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        setError(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');

    try {
        // Prepare order items
        const orderItems = cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images?.[0] || item.product.image || ''
        }));      // Save shipping address for future use
      await fetch('/api/users/shipping-address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingAddress)
      });

      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod,
          totalAmount: calculateTotal(),
          notes
        })
      });

      const orderData = await orderResponse.json();

      if (orderData.success) {
        router.push(`/orders/${orderData.order._id}?success=true`);
      } else {
        setError(orderData.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setError('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto text-center min-h-[60vh] flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.product._id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={item.product.images?.[0] || item.product.image || '/placeholder.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size}, Color: {item.color}
                    </p>
                    <p className="text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total: ${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address *</label>
                <textarea
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleShippingChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method *</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'COD')}
                      className="mr-2"
                    />
                    Cash on Delivery (COD)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="ONLINE"
                      checked={paymentMethod === 'ONLINE'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'ONLINE')}
                      className="mr-2"
                    />
                    Online Payment (Coming Soon)
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-4">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting || paymentMethod === 'ONLINE'}
              className="w-full bg-black text-white py-3 rounded font-medium mt-6 hover:bg-gray-900 transition-colors disabled:bg-gray-400"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  Placing Order...
                </div>
              ) : (
                `Place Order - $${calculateTotal().toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
