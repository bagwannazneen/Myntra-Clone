
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setFilter } from '@/lib/store/productSlice';
import { gsap } from 'gsap';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Parse query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const sort = params.get('sort') as 'price-asc' | 'price-desc' | 'rating' | null;
    
    if (category) {
      dispatch(setFilter({ filterType: 'category', value: category }));
    }
    
    if (sort) {
      dispatch(setFilter({ filterType: 'sort', value: sort }));
    }
  }, [location.search, dispatch]);
  
  useEffect(() => {
    if (pageRef.current) {
      const heading = pageRef.current.querySelector('h1');
      const description = pageRef.current.querySelector('p');
      
      gsap.fromTo(
        heading,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );
      
      gsap.fromTo(
        description,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.2 }
      );
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div ref={pageRef} className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">All Products</h1>
            <p className="text-muted-foreground mx-auto max-w-xl">
              Explore our wide selection of high-quality products
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters */}
            <div className="lg:w-1/4">
              <ProductFilters />
            </div>
            
            {/* Product Grid */}
            <div className="lg:w-3/4">
              <ProductGrid />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
