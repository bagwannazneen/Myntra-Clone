
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { productData } from '../data/products';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  description: string;
  rating: number;
  sizes: string[];
  colors: { name: string; code: string }[];
  isTrending?: boolean;
  isNewArrival?: boolean;
}

interface ProductState {
  items: Product[];
  filteredItems: Product[];
  filters: {
    category: string | null;
    priceRange: [number, number] | null;
    size: string | null;
    color: string | null;
    sort: 'price-asc' | 'price-desc' | 'rating' | null;
  };
}

const initialState: ProductState = {
  items: productData,
  filteredItems: productData,
  filters: {
    category: null,
    priceRange: null,
    size: null,
    color: null,
    sort: null,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{
        filterType: keyof ProductState['filters'];
        value: any;
      }>
    ) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
      
      // Apply all current filters
      let filtered = state.items;
      
      if (state.filters.category) {
        filtered = filtered.filter(item => item.category === state.filters.category);
      }
      
      if (state.filters.priceRange) {
        filtered = filtered.filter(
          item => 
            item.price >= state.filters.priceRange![0] && 
            item.price <= state.filters.priceRange![1]
        );
      }
      
      if (state.filters.size) {
        filtered = filtered.filter(item => 
          item.sizes.includes(state.filters.size!)
        );
      }
      
      if (state.filters.color) {
        filtered = filtered.filter(item => 
          item.colors.some(c => c.name === state.filters.color)
        );
      }
      
      // Apply sorting
      if (state.filters.sort === 'price-asc') {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
      } else if (state.filters.sort === 'price-desc') {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
      } else if (state.filters.sort === 'rating') {
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
      }
      
      state.filteredItems = filtered;
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: null,
        priceRange: null,
        size: null,
        color: null,
        sort: null,
      };
      state.filteredItems = state.items;
    },
    
    searchProducts: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      if (!searchTerm) {
        state.filteredItems = state.items;
        return;
      }
      
      state.filteredItems = state.items.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }
  },
});

export const { setFilter, clearFilters, searchProducts } = productSlice.actions;

export const selectProducts = (state: RootState) => state.products.items;
export const selectFilteredProducts = (state: RootState) => state.products.filteredItems;
export const selectFilters = (state: RootState) => state.products.filters;

export default productSlice.reducer;
