
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server"; // Adjust the path as necessary


// Load user
export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/user/getuser`, {
        withCredentials: true,
      });
      return data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);

// Async action to update user information
export const updateUserInformation = createAsyncThunk(
  "user/updateUserInformation",
  async ({ email, password, phoneNumber, name }, { rejectWithValue }) => {
    try {
      // Make a PUT request to update user information
      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        { email, password, phoneNumber, name },
        { withCredentials: true }
      );

      // Return the updated user data from the response
      return data.user;
    } catch (error) {
      // Log the error message (if any) for debugging
      console.error("Error updating user info:", error.response?.data);

      // Handle the rejection with a meaningful message or fallback message
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while updating user information."
      );
    }
  }
);

// Define action types
const UPDATE_USER_ADDRESS_REQUEST = "updateUserAddressRequest";
const UPDATE_USER_ADDRESS_SUCCESS = "updateUserAddressSuccess";
const UPDATE_USER_ADDRESS_FAILED = "updateUserAddressFailed";

export const updateUserAddress =
  (country, city, address1, address2, addressType) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_USER_ADDRESS_REQUEST });

      const { data } = await axios.put(
        `${server}/user/update-user-address`,
        { country, city, address1, address2, addressType },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch({
          type: UPDATE_USER_ADDRESS_SUCCESS,
          payload: {
            SuccessMessage: "User address updated successfully!",
            user: data.user,
          },
        });

        // Show success message only when address is successfully updated
       // toast.success("Address updated successfully!");
      }
    } catch (error) {
      // Capture backend error message
      const errorMessage =
        error.response?.data?.message || "Failed to update address";

      // Dispatch failure action
      dispatch({
        type: UPDATE_USER_ADDRESS_FAILED,
        payload: errorMessage,
      });

      // Show error message using Toastify only when there's an error
     // toast.error(errorMessage);
    }
  };
 
  export const deleteUserAddress = createAsyncThunk(
    "user/deleteUserAddress",
    async (id, { rejectWithValue }) => {
      try {
        // Ensure the id is a string
        const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, { withCredentials: true });
        return {
          SuccessMessage: "Address deleted successfully!",
          user: data.user,
        };
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

  // get all users -- admin
  export const getAllUsers = () => async (dispatch) => {
    try {
      dispatch({
        type: "getAllUsersRequest",
      });
  
      const { data } = await axios.get(`${server}/user/admin-all-users`, {
        withCredentials: true,
      });
  
      dispatch({
        type: "getAllUsersSuccess",
        payload: data.users,
      });
    } catch (error) {
      dispatch({
        type: "getAllUsersFailed",
        payload: error.response.data.message,
      });
    }
  };

  // load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};
