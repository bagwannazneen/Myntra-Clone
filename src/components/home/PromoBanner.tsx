
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PromoBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const banner = bannerRef.current;
    
    if (banner) {
      const elements = {
        bg: banner.querySelector('.promo-bg'),
        content: banner.querySelector('.promo-content'),
        title: banner.querySelector('.promo-title'),
        subtitle: banner.querySelector('.promo-subtitle'),
        cta: banner.querySelector('.promo-cta'),
      };
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: banner,
          start: 'top bottom-=100',
          toggleActions: 'play none none none',
        }
      });
      
      tl.fromTo(
        elements.bg,
        { scale: 1.1, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
      );
      
      tl.fromTo(
        elements.content,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.8'
      );
      
      tl.fromTo(
        elements.title,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.6'
      );
      
      tl.fromTo(
        elements.subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
      
      tl.fromTo(
        elements.cta,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={bannerRef} className="py-16 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl">
          {/* Background */}
          <div 
            className="promo-bg absolute inset-0 bg-gradient-to-r from-myntra-purple/90 to-myntra-pink/90 transform"
          ></div>
          
          <div className="relative z-10 py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
            {/* Content */}
            <div className="promo-content text-center md:text-left md:w-1/2 mb-8 md:mb-0">
              <h3 className="promo-subtitle text-white text-xl font-medium mb-2">Special Offer</h3>
              <h2 className="promo-title text-white text-4xl md:text-5xl font-bold mb-4">
                Get 30% Off<br />Summer Collection
              </h2>
              <p className="text-white/80 mb-6 max-w-md">
                Upgrade your wardrobe with our stunning summer collection. Limited time offer!
              </p>
              <Link 
                to="/products" 
                className="promo-cta inline-block bg-white text-myntra-purple font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
            
            {/* Image placeholder */}
            <div className="w-full md:w-1/3">
              <img 
                src="/placeholder.svg" 
                alt="Summer Collection" 
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
