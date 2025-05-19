
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { bannerData } from '@/lib/data/products';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1));
  };

  // Auto slide change
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (timeline.current) {
      timeline.current.kill();
    }

    timeline.current = gsap.timeline();
    
    // Animate all slides out of view
    slideRefs.current.forEach((slide, index) => {
      if (slide && index !== currentSlide) {
        gsap.set(slide, { opacity: 0, xPercent: index < currentSlide ? -100 : 100 });
      }
    });
    
    // Animate current slide
    if (slideRefs.current[currentSlide]) {
      const currentSlideEl = slideRefs.current[currentSlide];
      const content = currentSlideEl?.querySelector('.banner-content');
      const image = currentSlideEl?.querySelector('.banner-image');
      const button = currentSlideEl?.querySelector('.banner-cta');
      
      timeline.current
        .set(currentSlideEl, { opacity: 1, xPercent: 0 })
        .fromTo(
          content, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.2
        )
        .fromTo(
          image, 
          { opacity: 0, scale: 1.05 }, 
          { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
          0
        )
        .fromTo(
          button, 
          { opacity: 0, y: 10 }, 
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          0.4
        );
    }
  }, [currentSlide]);

  return (
    <div className="relative overflow-hidden" ref={sliderRef}>
      {/* Slides */}
      {bannerData.map((banner, index) => (
        <div
          key={banner.id}
          ref={el => (slideRefs.current[index] = el)}
          className={`h-[50vh] md:h-[70vh] w-full relative ${
            index === currentSlide ? 'block' : 'hidden'
          }`}
        >
          <div
            className="banner-image absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${banner.image})`, backgroundColor: '#f3f4f6' }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
          
          {/* Content */}
          <div className="container mx-auto px-4 h-full flex items-center z-20 relative">
            <div className="banner-content text-white max-w-md">
              <h2 className="text-xl md:text-2xl font-medium mb-1">{banner.subtitle}</h2>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h1>
              <Link 
                to="/products" 
                className="banner-cta inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                {banner.ctaText}
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-20 transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-20 transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-20">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
