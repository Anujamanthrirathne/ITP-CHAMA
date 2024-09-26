import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts } from '../../../redux/actions/product';
import styles from '../../../styles/styles';
import ProductCard from '../ProductCard/ProductCard';

const FeaturedProduct = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading, error } = useSelector((state) => state.products);
console.log(allProducts)
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Featured Products</h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
        {allProducts.length > 0 ? (
          allProducts.map((product) => (
            <ProductCard data={product} key={product._id} />
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;
