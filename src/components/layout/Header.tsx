import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toggleCart } from '@/lib/store/cartSlice';
import { toggleTheme, selectIsDarkMode } from '@/lib/store/themeSlice';
import { selectCartItemsCount } from '@/lib/store/cartSlice';
import { searchProducts } from '@/lib/store/productSlice';
import { gsap } from 'gsap';
import { Sun, Moon, ShoppingCart, Search, Menu, X, ChevronDown, User } from 'lucide-react';
import { useAppDispatch } from '@/lib/store';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector(selectIsDarkMode);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleToggleCart = () => {
    dispatch(toggleCart());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm));
      navigate('/products');
      setSearchOpen(false);
    }
  };

  const toggleSearchBar = () => {
    setSearchOpen((prev) => !prev);
    if (!searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchProducts(searchTerm));
      navigate('/products');
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    const mm = window.matchMedia('(min-width: 768px)');
    const handleResize = () => {
      if (mm.matches) {
        setMobileMenuOpen(false);
      }
    };
    mm.addEventListener('change', handleResize);
    return () => mm.removeEventListener('change', handleResize);
  }, []);

  // GSAP animation for header
  useEffect(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);

  return (
    <header 
      ref={headerRef} 
      className={`sticky top-0 z-50 border-b theme-transition ${
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-myntra-purple to-myntra-pink bg-clip-text text-transparent">
              MyMyntra
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <div className="relative group">
              <Link to="/products" className="nav-link flex items-center">
                Products <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 top-full left-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 mt-1">
                <Link to="/products?category=Men" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Men</Link>
                <Link to="/products?category=Women" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Women</Link>
                <Link to="/products?category=Kids" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Kids</Link>
                <Link to="/products?category=Sports" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Sports</Link>
              </div>
            </div>
            <Link to="/trending" className="nav-link">Trending</Link>
            <Link to="/new-arrivals" className="nav-link">New Arrivals</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={toggleSearchBar}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <div
                className={`absolute right-0 top-full mt-2 w-80 transition-all duration-300 origin-top-right ${
                  searchOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                }`}
              >
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for products..."
                    className="w-full px-4 py-2 outline-none bg-transparent"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button 
                    type="submit" 
                    className="p-2 text-primary"
                    aria-label="Submit search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Account */}
            <Link to="/account" className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={handleToggleCart}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-myntra-pink text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col space-y-4 py-4">
            <Link 
              to="/" 
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/trending" 
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </Link>
            <Link 
              to="/new-arrivals" 
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link 
              to="/account" 
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Account
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
