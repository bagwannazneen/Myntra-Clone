
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '@/lib/data/products';
import { selectIsDarkMode } from '@/lib/store/themeSlice';
import { useSelector } from 'react-redux';

gsap.registerPlugin(ScrollTrigger);

const CategorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isDarkMode = useSelector(selectIsDarkMode);

  useEffect(() => {
    const section = sectionRef.current;
    const categories = categoryRefs.current;
    
    if (section && categories.length > 0) {
      // Animate section title
      gsap.fromTo(
        section.querySelector('h2'),
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
      
      // Animate each category with stagger
      gsap.fromTo(
        categories,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
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
    <section className="py-16" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Shop By Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              ref={el => (categoryRefs.current[index] = el)}
              className="group"
            >
              <Link 
                to={`/products?category=${category.name}`} 
                className={`block rounded-lg overflow-hidden transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white font-medium text-lg">{category.name}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
