// reducers/productReducer.js

import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  products: [],
  product: null,
  success: false,
  error: null,
  allProducts: [],
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('productCreateRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('productCreateSuccess', (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase('productCreateFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase('getAllProductsShopRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getAllProductsShopSuccess', (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase('getAllProductsShopFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase('getProductDetailsRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getProductDetailsSuccess', (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
    })
    .addCase('getProductDetailsFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase('productUpdateRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('productUpdateSuccess', (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
    })
    .addCase('productUpdateFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    .addCase('deleteProductRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('deleteProductSuccess', (state, action) => {
      state.isLoading = false;
      state.success = true;
    })
    .addCase('deleteProductFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase('getAllProductsRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getAllProductsSuccess', (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload;
    })
    .addCase('getAllProductsFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
});
