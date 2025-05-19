
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProductCard from '../products/ProductCard';
import { useSelector } from 'react-redux';
import { selectProducts } from '@/lib/store/productSlice';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TrendingProducts = () => {
  const products = useSelector(selectProducts);
  const trendingProducts = products.filter(product => product.isTrending).slice(0, 4);
  const sectionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const productsContainer = productsRef.current;
    
    if (section && productsContainer) {
      // Animate section title
      gsap.fromTo(
        section.querySelector('.section-title'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom-=100',
            toggleActions: 'play none none none',
          },
        }
      );
      
      // Animate products
      gsap.fromTo(
        productsContainer.querySelectorAll('.product-item'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.6,
          scrollTrigger: {
            trigger: productsContainer,
            start: 'top bottom-=50',
            toggleActions: 'play none none none',
          },
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title text-3xl font-bold">Trending Now</h2>
          <Link 
            to="/trending" 
            className="flex items-center text-primary hover:text-myntra-purple-dark transition-colors"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <div key={product.id} className="product-item">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
