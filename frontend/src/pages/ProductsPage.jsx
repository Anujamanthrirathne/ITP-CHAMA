import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Footer from "../components/Route/Footer/Footer";
import { useSelector } from "react-redux";

const ProductsPage = () => {
  const [searchParms] = useSearchParams();
  const categoryData = searchParms.get("category");
  const { allProducts } = useSelector((state) => state.products);
  const [data, setData] = useState([]);

  useEffect(() => {
    let filteredData = allProducts || [];

    if (categoryData) {
      filteredData = filteredData.filter((i) => i.category === categoryData);
    }

    // Create a copy of the filteredData array and sort the copy
    const sortedData = [...filteredData].sort((a, b) => a.sold_out - b.sold_out);
    setData(sortedData);
  }, [categoryData, allProducts]);

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
        {data && data.length === 0 ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">
            No products Found!
          </h1>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
