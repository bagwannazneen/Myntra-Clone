
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Animation
    gsap.fromTo(
      ".not-found-content",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center py-20 px-4">
        <div className="text-center not-found-content">
          <h1 className="text-9xl font-bold text-myntra-purple mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            We're sorry, but the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-myntra-purple-dark transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              to="/products"
              className="bg-secondary text-foreground px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
