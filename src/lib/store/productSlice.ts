
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.';
import { fetchProducts, searchProductsApi } from '../services/api';

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
    searchQuery: string | null;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  filteredItems: [],
  filters: {
    category: null,
    priceRange: null,
    size: null,
    color: null,
    sort: null,
    searchQuery: null,
  },
  status: 'idle',
  error: null,
};

// Async thunk for fetching products
export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetchProducts();
    return response;
  }
);

// Async thunk for searching products
export const searchProductsAsync = createAsyncThunk(
  'products/searchProducts',
  async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return [];
    }
    const response = await searchProductsApi(searchTerm);
    return response;
  }
);

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
      
      // Apply search query if exists
      if (state.filters.searchQuery) {
        const searchTerm = state.filters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
      }
      
      // Apply category filter
      if (state.filters.category) {
        filtered = filtered.filter(item => item.category === state.filters.category);
      }
      
      // Apply price range filter
      if (state.filters.priceRange) {
        filtered = filtered.filter(
          item => 
            item.price >= state.filters.priceRange![0] && 
            item.price <= state.filters.priceRange![1]
        );
      }
      
      // Apply size filter
      if (state.filters.size) {
        filtered = filtered.filter(item => 
          item.sizes.includes(state.filters.size!)
        );
      }
      
      // Apply color filter
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
        searchQuery: null,
      };
      
      state.filteredItems = state.items;
    },
    
    searchProducts: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      state.filters.searchQuery = searchTerm || null;
      
      if (!searchTerm) {
        // If search is cleared, apply only other filters
        const actionPayload = { type: 'products/setFilter', payload: { filterType: 'category', value: state.filters.category } };
        productSlice.caseReducers.setFilter(state, actionPayload as any);
        return;
      }
      
      // Apply search term and other filters
      state.filteredItems = state.items.filter(
        product => 
          (product.name.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)) &&
          (!state.filters.category || product.category === state.filters.category) &&
          (!state.filters.size || product.sizes.includes(state.filters.size)) &&
          (!state.filters.color || product.colors.some(c => c.name === state.filters.color)) &&
          (!state.filters.priceRange || 
            (product.price >= state.filters.priceRange[0] && product.price <= state.filters.priceRange[1]))
      );
      
      // Apply sorting if needed
      if (state.filters.sort === 'price-asc') {
        state.filteredItems = [...state.filteredItems].sort((a, b) => a.price - b.price);
      } else if (state.filters.sort === 'price-desc') {
        state.filteredItems = [...state.filteredItems].sort((a, b) => b.price - a.price);
      } else if (state.filters.sort === 'rating') {
        state.filteredItems = [...state.filteredItems].sort((a, b) => b.rating - a.rating);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProductsAsync
      .addCase(fetchProductsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        
        // Apply any existing filters to the new items
        if (Object.values(state.filters).some(filter => filter !== null)) {
          const actionPayload = { 
            type: 'products/setFilter', 
            payload: { 
              filterType: 'category', 
              value: state.filters.category 
            } 
          };
          productSlice.caseReducers.setFilter(state, actionPayload as any);
        } else {
          state.filteredItems = action.payload;
        }
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unknown error occurred';
      })
      // Handle searchProductsAsync
      .addCase(searchProductsAsync.fulfilled, (state, action) => {
        if (action.meta.arg && action.meta.arg.trim() !== '') {
          state.filteredItems = action.payload;
        } else {
          state.filteredItems = state.items;
        }
      });
  }
});

export const { setFilter, clearFilters, searchProducts } = productSlice.actions;

export const selectProducts = (state: RootState) => state.products.items;
export const selectFilteredProducts = (state: RootState) => state.products.filteredItems;
export const selectFilters = (state: RootState) => state.products.filters;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;

export default productSlice.reducer;
