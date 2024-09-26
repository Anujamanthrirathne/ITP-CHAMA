import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { backend_url } from "../../../server.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist.js";
import { addTocart } from "../../../redux/actions/cart.js";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings.jsx";

const ProductCard = ({ data,isEvent }) => {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  // Retrieve wishlist from state
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    // Check if the product is already in the wishlist
    const isInWishlist = wishlist.some((item) => item._id === data._id);
    setClick(isInWishlist);
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = () => {
    setClick(false);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = () => {
    setClick(true);
    dispatch(addToWishlist(data));
  };

 
  const addToCartHandler = (id) => {
    const isItemExists = cart?.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock Limited");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
       <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
        <img
          src={
            data.images && data.images.length > 0
              ? `${backend_url}${data.images[0].public_id}`
              : null
          }
          alt={data.name || "Product Image"}
          className="w-full h-[170px] object-contain"
        />
      </Link>

      <Link to={`/shop/preview/${data.shop?._id}`}>
        <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
      </Link>

      <Link to={`/product/${data._id}`}>
        <h4 className="pb-3 font-[500]">
          {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
        </h4>
        <div className="flex">
         <Ratings rating={data?.ratings} />
        </div>

        <div className="py-2 flex items-center justify-between">
          <div className="flex">
            <h5 className={`${styles.productDiscountPrice}`}>
              $
              {data.originalPrice === 0
                ? data.originalPrice
                : data.discountPrice}
            </h5>
            <h4 className={`${styles.price}`}>
              {data.originalPrice ? `$${data.originalPrice}` : null}
            </h4>
          </div>
          <span className="font-[400] text-[17px] text-[#32c95a]">{data?.sold_out} sold </span>
        </div>
      </Link>

      {/* Side options */}
      <div>
        {click ? (
          <AiFillHeart
            size={22}
            className="cursor-pointer absolute right-2 top-5"
            onClick={removeFromWishlistHandler}
            color="red"
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer absolute right-2 top-5"
            onClick={addToWishlistHandler}
            color="#333"
            title="Add to wishlist"
          />
        )}
        <AiOutlineEye
          size={22}
          className="cursor-pointer absolute right-2 top-14"
          onClick={() => setOpen(!open)}
          color="#333"
          title="Quick view"
        />
        <AiOutlineShoppingCart
          size={25}
          className="cursor-pointer absolute right-2 top-24"
          onClick={() =>addToCartHandler(data._id)}
          color="#444"
          title="Add to cart"
        />

        {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
      </div>
    </div>
  );
};

export default ProductCard;
