
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '@/lib/store/themeSlice';

const Footer = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  return (
    <footer className={`py-10 border-t theme-transition ${
      isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Online Shopping */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Online Shopping</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=Men" className="text-muted-foreground hover:text-primary transition-colors">Men</Link></li>
              <li><Link to="/products?category=Women" className="text-muted-foreground hover:text-primary transition-colors">Women</Link></li>
              <li><Link to="/products?category=Kids" className="text-muted-foreground hover:text-primary transition-colors">Kids</Link></li>
              <li><Link to="/products?category=Accessories" className="text-muted-foreground hover:text-primary transition-colors">Accessories</Link></li>
              <li><Link to="/products?category=Electronics" className="text-muted-foreground hover:text-primary transition-colors">Electronics</Link></li>
            </ul>
          </div>

          {/* Customer Policies */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Policies</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Shop By */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop By</h3>
            <ul className="space-y-2">
              <li><Link to="/trending" className="text-muted-foreground hover:text-primary transition-colors">Trending</Link></li>
              <li><Link to="/new-arrivals" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/products?sort=price-asc" className="text-muted-foreground hover:text-primary transition-colors">Price (Low to High)</Link></li>
              <li><Link to="/products?sort=price-desc" className="text-muted-foreground hover:text-primary transition-colors">Price (High to Low)</Link></li>
              <li><Link to="/products?sort=rating" className="text-muted-foreground hover:text-primary transition-colors">Customer Rating</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Stay Connected</h3>
            <p className="text-muted-foreground mb-4">Subscribe to our newsletter for updates on new arrivals, offers, and more</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 rounded-l-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 rounded-r-lg font-medium hover:bg-myntra-purple-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025 MyMyntra. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Security</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
