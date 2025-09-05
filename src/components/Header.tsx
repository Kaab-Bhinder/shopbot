'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  
  // Debug logs
  console.log('Header - cartCount:', cartCount, 'wishlistCount:', wishlistCount);
  
  const links = [
    { "fname": "Home", "href": "/" },
    { "fname": "Men", "href": "/men" },
    { "fname": "Women", "href": "/women" },
    { "fname": "New In", "href": "/new-ins" },
    
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              SHOP BOT
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            {links.map((link) => (
              <Link
                key={link.fname}
                href={link.href}
                className="relative text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                {link.fname}

                {link.fname === "Try On" && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    HOT
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {!loading && (
              <>
                {user ? (
                  // User is logged in - show user menu and cart
                  <>
                    <Link href="/wishlist" className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistCount > 99 ? '99+' : wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link href="/cart" className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {cartCount > 99 ? '99+' : cartCount}
                        </span>
                      )}
                    </Link>
                    <div className="relative group">
                      <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
                        <span className="text-sm font-medium">{user.fullname}</span>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // User is not logged in - show login/signup buttons
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/login"
                      className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-black transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
