// actions/product.js

import axios from "axios";
import { server } from "../../server";

// Get product details by id
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getProductDetailsRequest" });

    const { data } = await axios.get(`${server}/product/get-product/${id}`);

    dispatch({
      type: "getProductDetailsSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "getProductDetailsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Create product
export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(`${server}/product/create-product`, newForm, config);

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });

    const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`);
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Update product
export const updateProduct = (id, updatedForm) => async (dispatch) => {
  try {
    dispatch({ type: "productUpdateRequest" });

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.put(`${server}/product/update-product/${id}`, updatedForm, config);

    dispatch({
      type: "productUpdateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productUpdateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });

    const { data } = await axios.get(`${server}/product/get-all-products`);

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
