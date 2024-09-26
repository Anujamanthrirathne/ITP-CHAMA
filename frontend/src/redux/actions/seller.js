import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Fetch the current seller's details
export const loadSeller = createAsyncThunk(
  "seller/loadSeller",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${server}/shop/getSeller`, {
        withCredentials: true,
      });
      return data.seller;
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to fetch seller");
    }
  }
);

// get all sellers --- admin
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllSellersRequest",
    });

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllSellersSuccess",
      payload: data.sellers,
    });
  } catch (error) {
    dispatch({
      type: "getAllSellerFailed",
    //   payload: error.response.data.message,
    });
  }
};