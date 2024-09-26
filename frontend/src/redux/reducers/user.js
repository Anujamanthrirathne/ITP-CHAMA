import { createReducer } from "@reduxjs/toolkit";
import { loadUser, updateUserInformation } from "../actions/user"; // Adjust the path if necessary
import { deleteUserAddress } from "../actions/user";
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  addressloading: false,
  users:null
};

// Define action update types
const UPDATE_USER_ADDRESS_REQUEST = "updateUserAddressRequest";
const UPDATE_USER_ADDRESS_SUCCESS = "updateUserAddressSuccess";
const UPDATE_USER_ADDRESS_FAILED = "updateUserAddressFailed";



const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loadUser.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })

    //update user
    .addCase(updateUserInformation.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateUserInformation.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(updateUserInformation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

   
// Update user address
.addCase(UPDATE_USER_ADDRESS_REQUEST, (state) => {
  state.addressloading = true;
})
.addCase(UPDATE_USER_ADDRESS_SUCCESS, (state, action) => {
  state.addressloading = false;
  state.SuccessMessage = action.payload.SuccessMessage;
  state.user = action.payload.user;
})
.addCase(UPDATE_USER_ADDRESS_FAILED, (state, action) => {
  state.addressloading = false;
  state.error = action.payload;
})


// Delete user address
.addCase(deleteUserAddress.pending, (state) => {
  state.addressloading = true;
})
.addCase(deleteUserAddress.fulfilled, (state, action) => {
  state.addressloading = false;
  state.SuccessMessage = action.payload.SuccessMessage;
  state.user = action.payload.user;
})
.addCase(deleteUserAddress.rejected, (state, action) => {
  state.addressloading = false;
  state.error = action.payload;
})

   // Get all users admin
   .addCase("getAllUsersRequest", (state) => {
    state.loading = true;
  })
  .addCase("getAllUsersSuccess", (state, action) => {
    state.loading = false;
    state.users = action.payload;
  })
  .addCase("getAllUsersFailed", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

  .addCase("clearErrors", (state) => {
    state.error = null;
  });
});


export default userReducer;
