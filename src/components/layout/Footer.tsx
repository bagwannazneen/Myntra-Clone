
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '@/lib/store/themeSlice';

const Footer = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const location = useLocation();
  
  // Helper function to create safe links
  const SafeLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
    // Use regular anchor for external links (starting with http)
    if (to.startsWith('http') || to === '#') {
      return (
        <a href={to} className={className} target={to.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    // Use React Router Link for internal links
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  };
  
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
              <li><SafeLink to="/products?category=Men" className="text-muted-foreground hover:text-primary transition-colors">Men</SafeLink></li>
              <li><SafeLink to="/products?category=Women" className="text-muted-foreground hover:text-primary transition-colors">Women</SafeLink></li>
              <li><SafeLink to="/products?category=Kids" className="text-muted-foreground hover:text-primary transition-colors">Kids</SafeLink></li>
              <li><SafeLink to="/products?category=Accessories" className="text-muted-foreground hover:text-primary transition-colors">Accessories</SafeLink></li>
              <li><SafeLink to="/products?category=Electronics" className="text-muted-foreground hover:text-primary transition-colors">Electronics</SafeLink></li>
            </ul>
          </div>

          {/* Customer Policies */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Policies</h3>
            <ul className="space-y-2">
              <li><SafeLink to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</SafeLink></li>
              <li><SafeLink to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</SafeLink></li>
              <li><SafeLink to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</SafeLink></li>
              <li><SafeLink to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</SafeLink></li>
              <li><SafeLink to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</SafeLink></li>
            </ul>
          </div>

          {/* Shop By */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop By</h3>
            <ul className="space-y-2">
              <li><SafeLink to="/trending" className="text-muted-foreground hover:text-primary transition-colors">Trending</SafeLink></li>
              <li><SafeLink to="/new-arrivals" className="text-muted-foreground hover:text-primary transition-colors">New Arrivals</SafeLink></li>
              <li><SafeLink to="/products?sort=price-asc" className="text-muted-foreground hover:text-primary transition-colors">Price (Low to High)</SafeLink></li>
              <li><SafeLink to="/products?sort=price-desc" className="text-muted-foreground hover:text-primary transition-colors">Price (High to Low)</SafeLink></li>
              <li><SafeLink to="/products?sort=rating" className="text-muted-foreground hover:text-primary transition-colors">Customer Rating</SafeLink></li>
            </ul>
          </div>

          {/* Newsletter */}
          
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025 MyMyntra. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <SafeLink to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</SafeLink>
              <SafeLink to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</SafeLink>
              <SafeLink to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Security</SafeLink>
              <SafeLink to="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Sitemap</SafeLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
