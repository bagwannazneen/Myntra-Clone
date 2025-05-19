
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Product } from './productSlice';

interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{
        product: Product;
        quantity: number;
        selectedSize?: string;
        selectedColor?: string;
      }>
    ) => {
      const { product, quantity, selectedSize, selectedColor } = action.payload;
      
      const existingItemIndex = state.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
      );
      
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        state.items.push({
          product,
          quantity,
          selectedSize,
          selectedColor,
        });
      }
    },
    
    removeFromCart: (state, action: PayloadAction<number>) => {
      const itemIndex = action.payload;
      state.items = state.items.filter((_, index) => index !== itemIndex);
    },
    
    updateQuantity: (
      state,
      action: PayloadAction<{ index: number; quantity: number }>
    ) => {
      const { index, quantity } = action.payload;
      if (state.items[index]) {
        state.items[index].quantity = quantity;
      }
    },
    
    clearCart: (state) => {
      state.items = [];
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    
    closeCart: (state) => {
      state.isOpen = false;
    },
    
    openCart: (state) => {
      state.isOpen = true;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  closeCart,
  openCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectIsCartOpen = (state: RootState) => state.cart.isOpen;

export default cartSlice.reducer;
