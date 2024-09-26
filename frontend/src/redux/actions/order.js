
import axios from "axios";
import { server } from "../../server";

//get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrderUserRequest",
    });
    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );
    dispatch({
      type: "getAllOrderUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrderUseFail",
      payload: error.response.data.message,
    });
  }
};

// ge all order of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrderShopRequest",
    });
    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders/${shopId}`
    );
    dispatch({
      type: "getAllOrderShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrderShopFail",
      payload: error.response.data.message,
    });
  }
};

// get all orders of Admin
export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: "adminAllOrdersRequest",
    });

    const { data } = await axios.get(`${server}/order/admin-all-orders`, {
      withCredentials: true,
    });

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.response.data.message,
    });
  }
};
