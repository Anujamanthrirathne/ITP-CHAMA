// Add to cart action
export const addTocart = (data) => (dispatch, getState) => {
    dispatch({
      type: "addToCart",
      payload: data,
    });
    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  };
  
  // Remove from cart action
  export const removeFromCart = (data) => (dispatch, getState) => {
    dispatch({
      type: "removeFromCart",
      payload:data._id,
    });
    // Update localStorage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  };
  