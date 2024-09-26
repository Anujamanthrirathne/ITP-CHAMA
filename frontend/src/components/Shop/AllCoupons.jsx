import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../components/Shop/Layout/Loader";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupons(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  }, [seller._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true }
      );

      toast.success("Coupon created successfully!");
      setOpen(false); 
      setCoupons([...coupons, res.data.couponCode]);
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    axios.delete(`${server}/coupon/delete-coupon/${id}`,{withCredentials: true}).then((res) => {
      toast.success("Coupon code deleted successfully!")
    })
    window.location.reload();
  };

  const columns = [
    { field: "id", headerName: "Coupon Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "value", headerName: "Value", minWidth: 100, flex: 0.6 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.row.id)}>
          <AiOutlineDelete size={20} />
        </Button>
      ),
    },
  ];

  const rows = coupons
    ? coupons.map((item) => ({
        id: item._id,
        name: item.name,
        value: `${item.value}%`,
      }))
    : [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[20000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-auto max-h-[80vh] bg-white rounded-md shadow p-6 overflow-y-auto">
                <div className="w-full flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center mb-4">
                  Create Coupon Code
                </h5>
                {/* Create coupon code form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className="mt-2 appearance-none block w-full px-3 h-[40px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon code name..."
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="pb-2">
                      Discount Percentage <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[40px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter your coupon code value..."
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[40px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Enter minimum amount for coupon..."
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[40px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter maximum amount for coupon..."
                      style={{ outline: "none" }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="pb-2">Apply on Products</label>
                    <select
                      name="selectedProducts"
                      value={selectedProducts}
                      className="mt-2 block w-full px-3 h-[40px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="">Select Products</option>
                      {products &&
                        products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                    <br />
                  <div>
                    <input
                      type="submit"
                      value="Create"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                   
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
