
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { addToCart } from '@/lib/store/cartSlice';
import { selectProducts } from '@/lib/store/productSlice';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import ProductDetailCarousel from '@/components/products/ProductDetailCarousel';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, ChevronLeft, Check, Star } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const product = products.find(p => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Create multiple dummy images for the carousel
  const dummyImages = product ? [
    product.image,
    product.image,
    product.image,
    product.image
  ] : [];
  
  useEffect(() => {
    if (product) {
      // Set default selected size and color
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]?.name);
      
      // GSAP animations
      const tl = gsap.timeline();
      if (pageRef.current) {
        const elements = {
          breadcrumb: pageRef.current.querySelector('.breadcrumb'),
          title: pageRef.current.querySelector('.product-title'),
          price: pageRef.current.querySelector('.product-price'),
          details: pageRef.current.querySelector('.product-details'),
          actions: pageRef.current.querySelector('.product-actions'),
        };
        
        tl.fromTo(
          elements.breadcrumb,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0
        );
        
        tl.fromTo(
          elements.title,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.2
        );
        
        tl.fromTo(
          elements.price,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.3
        );
        
        tl.fromTo(
          elements.details,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.4
        );
        
        tl.fromTo(
          elements.actions,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          0.5
        );
      }
    }
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [product]);
  
  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      dispatch(addToCart({
        product,
        quantity,
        selectedSize,
        selectedColor
      }));
      
      toast.success('Added to cart', {
        description: `${product.name} has been added to your cart`,
      });
      
      // Add to cart animation
      if (pageRef.current) {
        const addToCartButton = pageRef.current.querySelector('.add-to-cart-btn');
        gsap.fromTo(
          addToCartButton,
          { scale: 1 },
          { 
            scale: 1.05, 
            duration: 0.2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 1
          }
        );
      }
    } else {
      toast.error('Please select options', {
        description: 'Please select size and color before adding to cart',
      });
    }
  };
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    
    // Animate the selected size button
    const sizeButtons = document.querySelectorAll('.size-button');
    sizeButtons.forEach(button => {
      if ((button as HTMLElement).dataset.size === size) {
        gsap.fromTo(
          button,
          { scale: 0.95 },
          { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
        );
      }
    });
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    
    // Animate the selected color button
    const colorButtons = document.querySelectorAll('.color-button');
    colorButtons.forEach(button => {
      if ((button as HTMLElement).dataset.color === color) {
        gsap.fromTo(
          button,
          { scale: 0.8 },
          { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)' }
        );
      }
    });
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
            <p className="mb-6">The product you are looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/products')}>
              Browse Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div ref={pageRef} className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="breadcrumb mb-8">
            <ol className="flex text-sm">
              <li className="flex items-center">
                <button 
                  onClick={() => navigate('/')}
                  className="hover:text-primary transition-colors"
                >
                  Home
                </button>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <button 
                  onClick={() => navigate('/products')}
                  className="hover:text-primary transition-colors"
                >
                  Products
                </button>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <button 
                  onClick={() => navigate(`/products?category=${product.category}`)}
                  className="hover:text-primary transition-colors"
                >
                  {product.category}
                </button>
                <span className="mx-2">/</span>
              </li>
              <li className="text-muted-foreground">{product.name}</li>
            </ol>
          </nav>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div>
              <ProductDetailCarousel images={dummyImages} />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="product-title text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="mr-4 text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 flex items-center px-2 py-1 rounded">
                  <Star className="h-3 w-3 fill-current mr-1" />
                  {product.rating}
                </div>
                <span className="text-sm text-muted-foreground">Brand: {product.brand}</span>
              </div>
              
              <div className="product-price mb-6">
                <div className="flex items-center">
                  <span className="text-2xl font-semibold">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-muted-foreground line-through ml-2">
                        ₹{product.originalPrice}
                      </span>
                      <span className="ml-2 text-green-600 font-medium">
                        {product.discountPercentage}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Inclusive of all taxes
                </p>
              </div>
              
              <div className="product-details space-y-6">
                {/* Size selector */}
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-medium">Select Size</h3>
                    <button className="text-sm text-primary hover:underline">
                      Size Chart
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        data-size={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`size-button w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          selectedSize === size
                            ? 'border-primary bg-primary/10 text-primary font-medium'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Color selector */}
                {product.colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Select Color</h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map(color => (
                        <button
                          key={color.name}
                          data-color={color.name}
                          onClick={() => handleColorSelect(color.name)}
                          className={`color-button w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                            selectedColor === color.name
                              ? 'ring-2 ring-primary ring-offset-2'
                              : ''
                          }`}
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        >
                          {selectedColor === color.name && (
                            <Check
                              className="h-5 w-5"
                              style={{ color: color.code === '#FFFFFF' || color.code === '#FFFF00' ? '#000' : '#fff' }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quantity selector */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Quantity</h3>
                  <div className="flex items-center border rounded max-w-[120px]">
                    <button 
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center">{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      className="w-10 h-10 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Product Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="product-actions grid grid-cols-2 gap-4 mt-8">
                <Button
                  onClick={handleAddToCart}
                  className="add-to-cart-btn flex items-center justify-center"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center"
                  size="lg"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
