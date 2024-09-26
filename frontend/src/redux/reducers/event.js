import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  events: [],
  event: null,
  success: false,
  error: null,
};

export const eventReducer = createReducer(initialState, (builder) => {
  builder

  //create events
    .addCase('eventCreateRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('eventCreateSuccess', (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.success = true;
    })
    .addCase('eventCreateFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })
    
    //get all events shop
    .addCase("getAlleventsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAlleventsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
    })
    .addCase("getAlleventsShopFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
     
    //delete events
    .addCase("deleteeventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteeventSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
    })
    .addCase("deleteeventFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
     
    //get all events
    .addCase("getAlleventsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAlleventsSuccess", (state, action) => {
      state.isLoading = false;
      state.allEvents = action.payload;
    })
    .addCase("getAlleventsFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
});
