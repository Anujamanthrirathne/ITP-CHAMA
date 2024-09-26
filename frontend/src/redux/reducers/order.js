// reducers/productReducer.js

import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  orders: [],
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    //get all orders of an user
    .addCase("getAllOrderUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrderUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrderUseFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders of a shop
    .addCase("getAllOrderShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrderShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrderShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    //get all orders admin
    .addCase("adminAllOrdersRequest", (state) => {
      state.adminOrderLoading = true;
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      state.adminOrderLoading = false;
    state.adminOrders = action.payload;
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      state.adminOrderLoading = false;
      state.error = action.payload;
    });
});
