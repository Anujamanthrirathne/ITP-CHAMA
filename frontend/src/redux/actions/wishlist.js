// Add to wishlist action
export const addToWishlist = (data) => (dispatch, getState) => {
    dispatch({
      type: "addToWishlist",
      payload: data,
    });
    // Update localStorage
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  };
  
  // Remove from wishlist action
  export const removeFromWishlist = (data) => (dispatch, getState) => {
    dispatch({
      type: "removeFromWishlist",
      payload: data._id,
    });
    // Update localStorage
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
  };
  