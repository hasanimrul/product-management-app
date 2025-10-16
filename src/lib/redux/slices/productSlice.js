import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  searchQuery: "",
  pagination: {
    offset: 0,
    limit: 10,
    total: 0,
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      if (state.currentProduct?.id === action.payload.id) {
        state.currentProduct = action.payload;
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  setCategories,
  addProduct,
  updateProduct,
  removeProduct,
  setLoading,
  setError,
  setSearchQuery,
  setPagination,
  clearError,
} = productsSlice.actions;

export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectCategories = (state) => state.products.categories;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectPagination = (state) => state.products.pagination;

export default productsSlice.reducer;
