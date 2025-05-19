
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectProducts } from '@/lib/store/productSlice';
import { gsap } from 'gsap';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';

const TrendingPage = () => {
  const products = useSelector(selectProducts);
  const trendingProducts = products.filter(product => product.isTrending);
  const pageRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  
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
    
    if (productsRef.current) {
      gsap.fromTo(
        productsRef.current.querySelectorAll('.product-item'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.4,
        }
      );
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div ref={pageRef} className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Trending Now</h1>
            <p className="text-muted-foreground mx-auto max-w-xl">
              Discover our most popular products that everyone's talking about
            </p>
          </div>
          
          {trendingProducts.length > 0 ? (
            <div 
              ref={productsRef} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {trendingProducts.map((product, index) => (
                <div key={product.id} className="product-item">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-medium mb-2">No trending products available</h3>
              <p className="text-muted-foreground">
                Check back soon for the latest trends.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrendingPage;
