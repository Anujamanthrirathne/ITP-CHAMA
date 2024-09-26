import { createReducer } from "@reduxjs/toolkit";

// Initial state, retrieving cart items from localStorage if available
const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);

      if (isItemExist) {
        // Replace the existing item with the new one
        state.cart = state.cart.map((i) => (i._id === isItemExist._id ? item : i));
      } else {
        // Add the new item to the cart
        state.cart.push(item);
      }
    })
    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
    });
});
