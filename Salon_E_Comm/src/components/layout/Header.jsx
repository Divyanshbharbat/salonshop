import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getAuthToken, removeAuthToken, categoryAPI } from '../../utils/apiClient';
import './Header.css';
import { Search, ShoppingCart, User, Package, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';

export default function Header() {
  const navigate = useNavigate();
  const { getCartTotal } = useCart();
  const { totalItems } = getCartTotal();
  const [searchValue, setSearchValue] = useState('');
  const isLoggedIn = !!getAuthToken();
  const userData = isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const cats = await categoryAPI.getAll();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        console.error('[Header] Failed to load categories', err.message || err);
      }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log('Searching for:', searchValue);
      alert(`Searching for products: "${searchValue}"`);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('user');

    // Dispatch auth change event so CartContext clears
    window.dispatchEvent(new Event('authChange'));

    alert('Logged out successfully');
    navigate('/');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleBecomeAgent = () => {
    if (!isLoggedIn) {
      navigate('/signup');
    } else {
      navigate('/become-seller');
    }
  };

  const handleCart = () => {
    if (!isLoggedIn) {
      alert('Please login to view your cart');
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <p className="header-promo">🎉 B2B EXCLUSIVE: Get up to 40% discount on professional ranges</p>
            <div className="header-top-links">
              <button className="header-link" onClick={handleBecomeAgent}>Become a Seller</button>
              <span className="separator">|</span>
              <button className="header-link" onClick={() => navigate('/help')}>Help Center</button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3">
        <div className="container flex flex-wrap items-center justify-between gap-y-4">
          <div className="logo flex items-center" onClick={handleHome} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">S</span>
            <span className="logo-text hidden md:inline ml-2">SalonPro</span>
          </div>

          {/* Actions - Closer together on mobile */}
          <div className="header-actions flex items-center gap-1 md:gap-3 order-2 md:order-3">
            <button className="border-2 border-transparent transition-all duration-300 hover:border-(--primary-color) p-1.5 rounded-md relative" onClick={handleCart}>
              <ShoppingCart className='text-black' size={20} />
              {totalItems > 0 && <span className="cart-count absolute -top-1 -right-1 bg-(--primary-color) text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white">{totalItems}</span>}
            </button>
            {!isLoggedIn ? (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handleLogin} className="px-2 md:px-4">Login</Button>
                <Button size="sm" onClick={handleSignup} className="px-2 md:px-4">Sign Up</Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <div className='bg-neutral-300 p-1 border-2 border-neutral-300 rounded-md transition-all duration-300 hover:border-(--primary-color)'>
                    <User className='text-black' size={24} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-bold text-base">My Account</DropdownMenuLabel>
                    <div className="px-2 py-1.5 border-b border-neutral-100 mb-1">
                      <p className="text-sm font-medium leading-none">{userData?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {userData?.email || 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer duration-300 transition-colors hover:bg-(--primary-color)/20" onClick={() => { }}>
                      <User size={16} />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer duration-300 transition-colors hover:bg-(--primary-color)/20" onClick={() => navigate('/my-orders')}>
                      <Package size={16} />
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer duration-300 transition-colors hover:bg-(--destructive)/20" variant='destructive' onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* <button className="btn-menu">☰</button> */}
          </div>

          {/* Search Bar - Full width on mobile, below icons */}
          <form className="flex items-center px-2 gap-2 w-full md:w-md border-b-2 border-(--border-color) focus-within:border-(--primary-color) order-3 md:order-2" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for professional products..."
              className="w-full py-1.5 rounded-lg focus:outline-none focus:ring-none text-sm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit" className="p-1"><Search className='text-black' size={18} /></button>
          </form>
        </div>
      </div>

      {categories && categories.length > 0 && (
        <div className="header-nav border-t border-(--border-color)">
          <div className="container">
            <nav className="flex justify-center items-center gap-8 py-3">
              {categories.slice(0, 8).map(c => (
                <button
                  key={c._id}
                  className="text-sm font-medium text-neutral-600 hover:text-(--primary-color) transition-colors duration-300 border-none bg-transparent cursor-pointer p-0 whitespace-nowrap"
                  onClick={() => handleCategoryClick(c.name)}
                >
                  {c.name}
                </button>
              ))}

              {categories.length > 8 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-(--primary-color) transition-colors duration-300 border-none bg-transparent cursor-pointer p-0 whitespace-nowrap">
                      More <ChevronDown size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="max-h-[300px] overflow-y-auto">
                    {categories.slice(8).map(c => (
                      <DropdownMenuItem
                        key={c._id}
                        className="cursor-pointer whitespace-nowrap hover:text-(--primary-color) transition-colors duration-300 font-medium text-neutral-600"
                        onClick={() => handleCategoryClick(c.name)}
                      >
                        {c.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          </div>
        </div>
      )}
    </header >
  );
}

