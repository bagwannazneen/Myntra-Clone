
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { Product } from '@/lib/store/productSlice';
import { addToCart, openCart } from '@/lib/store/cartSlice';
import { toast } from 'sonner';
import { selectIsDarkMode } from '@/lib/store/themeSlice';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity: 1,
        selectedSize: product.sizes[0],
        selectedColor: product.colors[0]?.name
      })
    );
    
    // Show toast notification
    toast.success('Added to cart', {
      description: `${product.name} has been added to your cart`,
      action: {
        label: 'View Cart',
        onClick: () => dispatch(openCart()),
      },
    });
    
    // Create floating element animation
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('.animate-to-cart');
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        
        // Create a clone of the product image
        const clone = document.createElement('img');
        clone.src = product.image;
        clone.style.position = 'fixed';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.width}px`;
        clone.style.objectFit = 'cover';
        clone.style.borderRadius = '8px';
        clone.style.zIndex = '9999';
        document.body.appendChild(clone);
        
        // Animate the clone
        gsap.to(clone, {
          duration: 0.8,
          x: cartRect.left - rect.left,
          y: cartRect.top - rect.top,
          scale: 0.1,
          opacity: 0,
          ease: 'power3.in',
          onComplete: () => {
            document.body.removeChild(clone);
          }
        });
      }
    }
  };
  
  // Card hover effect
  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = (x - centerX) / centerX;
        const tiltY = (y - centerY) / centerY;
        
        gsap.to(card, {
          rotationX: -tiltY * 5,
          rotationY: tiltX * 5,
          transformPerspective: 1000,
          duration: 0.5,
          ease: 'power1.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power1.out'
        });
      });
    }
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={`product-card group transform-gpu ${
        isDarkMode ? 'bg-gray-800 hover:shadow-lg hover:shadow-purple-900/20' : 'bg-white hover:shadow-lg hover:shadow-gray-200/50'
      }`}
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full aspect-square object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          
          {(product.discountPercentage && product.discountPercentage > 0) && (
            <div className="absolute top-0 left-0 bg-myntra-pink text-white text-xs font-medium px-2 py-1">
              -{product.discountPercentage}%
            </div>
          )}
          
          {product.isTrending && (
            <div className="absolute top-0 right-0 bg-myntra-purple text-white text-xs font-medium px-2 py-1">
              Trending
            </div>
          )}
          
          {product.isNewArrival && (
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium px-2 py-1">
              New
            </div>
          )}
        </Link>
        
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex justify-between items-center">
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors animate-to-cart"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            
            <button
              className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg truncate">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-semibold">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-muted-foreground line-through ml-2 text-sm">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-yellow-500">★</span>
            <span className="text-xs ml-1">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
