
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductDetailCarouselProps {
  images: string[];
}

const ProductDetailCarousel: React.FC<ProductDetailCarouselProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // GSAP animation for slide changes
  useEffect(() => {
    const currentSlideEl = slideRefs.current[currentSlide];
    
    if (currentSlideEl) {
      // Hide all slides
      slideRefs.current.forEach((slide, i) => {
        if (i !== currentSlide && slide) {
          gsap.set(slide, { opacity: 0, scale: 0.9 });
        }
      });
      
      // Show and animate current slide
      gsap.fromTo(
        currentSlideEl,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    }
  }, [currentSlide]);

  return (
    <div className="relative" ref={carouselRef}>
      {/* Main image */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square">
        {images.map((image, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className={`absolute inset-0 ${index === currentSlide ? 'block' : 'hidden'}`}
          >
            <img
              src={image || '/placeholder.svg'}
              alt={`Product view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                index === currentSlide
                  ? 'border-primary'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image || '/placeholder.svg'}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetailCarousel;
