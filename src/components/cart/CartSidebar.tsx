
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectIsCartOpen,
  closeCart,
  removeFromCart,
  updateQuantity
} from '@/lib/store/cartSlice';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { selectIsDarkMode } from '@/lib/store/themeSlice';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const isOpen = useSelector(selectIsCartOpen);
  const isDarkMode = useSelector(selectIsDarkMode);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
      
      gsap.fromTo(
        sidebarRef.current,
        { x: '100%' },
        { 
          x: '0%', 
          duration: 0.4,
          ease: 'power3.out',
        }
      );
    } else {
      document.body.style.overflow = '';
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });
      
      gsap.to(sidebarRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
      });
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  const handleClose = () => {
    dispatch(closeCart());
  };
  
  const handleRemoveItem = (index: number) => {
    const itemElement = document.getElementById(`cart-item-${index}`);
    
    if (itemElement) {
      gsap.to(itemElement, {
        x: 300,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          dispatch(removeFromCart(index));
        },
      });
    } else {
      dispatch(removeFromCart(index));
    }
  };
  
  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ index, quantity }));
      
      // Animation for quantity update
      const quantityElement = document.getElementById(`quantity-${index}`);
      if (quantityElement) {
        gsap.fromTo(
          quantityElement,
          { scale: 1.2 },
          { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.3)" }
        );
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'visible' : 'invisible'}`} 
        style={{ opacity: 0 }}
        onClick={handleClose}
      />
      
      {/* Cart Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed right-0 top-0 h-full w-full sm:w-96 z-50 transform translate-x-full ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">Your Cart</h2>
              {cartItems.length > 0 && (
                <span className="ml-2 bg-myntra-pink text-white text-xs px-2 py-1 rounded-full">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-grow overflow-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Button onClick={handleClose}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4 px-6">
                {cartItems.map((item, index) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} 
                    id={`cart-item-${index}`}
                    className={`flex border rounded-lg p-3 ${
                      isDarkMode ? 'border-gray-800' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <button 
                          onClick={() => handleRemoveItem(index)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.selectedSize && <span className="mr-2">Size: {item.selectedSize}</span>}
                        {item.selectedColor && (
                          <span className="inline-flex items-center">
                            Color: 
                            <span 
                              className="inline-block w-3 h-3 rounded-full ml-1 border-2" 
                              style={{ 
                                backgroundColor: item.product.colors.find(
                                  c => c.name === item.selectedColor
                                )?.code || '#000' 
                              }}
                            ></span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded">
                          <button 
                            className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span id={`quantity-${index}`} className="px-2 py-1 min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button 
                            className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => handleQuantityChange(index, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="font-medium">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="grid gap-3 mt-6">
                <Link 
                  to="/checkout" 
                  onClick={handleClose}
                  className="bg-primary text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-myntra-purple-dark transition-colors"
                >
                  Checkout
                </Link>
                <button 
                  onClick={handleClose}
                  className="bg-secondary text-foreground py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
