import { createReducer } from "@reduxjs/toolkit";
import { loadSeller } from "../actions/seller";

const initialState = {
  isLoading: true,
  isSeller: false,
  seller: null,
  error: null,
  sellers: [],
};

const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadSeller.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loadSeller.fulfilled, (state, action) => {
      state.isSeller = true;
      state.isLoading = false;
      state.seller = action.payload;
    })
    .addCase(loadSeller.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    })

    .addCase("getAllSellersRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllSellersSuccess", (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload; // Use semicolon instead of comma
    })
    .addCase("getAllSellerFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
});

export default sellerReducer;
