
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve the `dispatch` type
import { useDispatch } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
