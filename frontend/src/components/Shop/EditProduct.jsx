import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct, getProductDetails } from '../../redux/actions/product';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import Loader from './Layout/Loader';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProduct = () => {
  const { id } = useParams(); // Get product ID from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productState = useSelector((state) => state.product);
  const { product, isLoading, error } = productState || {}; // Safeguard against undefined state
  const [images, setImages] = useState([]);
  const { register, handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    dispatch(getProductDetails(id)); // Fetch product details using the ID from URL
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setValue('name', product.name || '');
      setValue('price', product.discountPrice || '');
      setValue('stock', product.stock || '');
      setValue('description', product.description || '');
      setImages(product.images || []);
      // Ensure to reset form values in case of new fetch
      reset({
        name: product.name || '',
        price: product.discountPrice || '',
        stock: product.stock || '',
        description: product.description || ''
      });
    }
  }, [product, setValue, reset]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('description', data.description);

    images.forEach((image) => {
      formData.append('images', image);
    });

    dispatch(updateProduct(id, formData))
    .then(() => {
      console.log('Update successful'); // Check if this log appears
      toast.success('Product updated successfully!');
      navigate('/dashboard');
    })
    .catch((error) => {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product.');
    });
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error fetching product details.</div>;

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <ToastContainer /> {/* ToastContainer to display toast notifications */}
      <h5 className="text-[30px] font-Poppins text-center">Edit Product</h5>
      <form onSubmit={handleSubmit(onSubmit)}>
        <br />
        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <TextField
            label="Name"
            fullWidth
            {...register('name')}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <TextField
            label="Price"
            type="number"
            fullWidth
            {...register('price')}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Stock <span className="text-red-500">*</span>
          </label>
          <TextField
            label="Stock"
            type="number"
            fullWidth
            {...register('stock')}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            {...register('description')}
            className="mt-2 appearance-none block w-full px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <br />
        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="upload"
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images && Array.from(images).map((file, index) => (
              <img
                src={URL.createObjectURL(file)}
                key={index}
                alt=""
                className="h-[120px] w-[120px] object-cover m-2"
              />
            ))}
          </div>
        </div>
        <br />
        <div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full mt-2"
          >
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
