
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { gsap } from 'gsap';
import ProductCard from './ProductCard';
import { selectFilteredProducts } from '@/lib/store/productSlice';

const ProductGrid = () => {
  const filteredProducts = useSelector(selectFilteredProducts);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // GSAP animation for the grid
  useEffect(() => {
    if (gridRef.current) {
      const products = gridRef.current.querySelectorAll('.product-item');
      
      gsap.fromTo(
        products,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    }
  }, [filteredProducts]);

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try changing your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div 
      ref={gridRef} 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filteredProducts.map((product, index) => (
        <div key={product.id} className="product-item">
          <ProductCard product={product} index={index} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
