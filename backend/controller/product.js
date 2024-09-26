
// routes/product.js

const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const Product = require("../model/product");
const { upload } = require("../multer");
const { isAuthenticated,isSeller, isAdmin } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
const Order = require("../model/order");
// Create product
router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncError(async (req, res, next) => {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Shop Id is Invalid!", 400));
    }

    const files = req.files;
    const imageUrls = files.map((file) => ({
      public_id: file.filename,
      url: `${file.path}`
    }));

    const productData = req.body;
    productData.images = imageUrls;
    productData.shop = shop;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
  })
);

// Get a single product by ID
router.get('/get-product/:id', catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found!", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
}));

// Get all products
router.get(
  "/get-all-products",
  catchAsyncError(async (req, res, next) => {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  })
);

// Get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncError(async (req, res, next) => {
    const products = await Product.find({ shopId: req.params.id });

    res.status(200).json({
      success: true,
      products,
    });
  })
);

// Update product
router.put(
  "/update-product/:id",
  upload.array("images"),
  catchAsyncError(async (req, res, next) => {
    const productId = req.params.id;
    const files = req.files;

    let product = await Product.findById(productId);
    if (!product) {
      return next(new ErrorHandler("Product not found with this id!", 404));
    }

    if (files && files.length > 0) {
      const imageUrls = files.map((file) => ({
        public_id: file.filename,
        url: `${file.path}`
      }));
      req.body.images = imageUrls;
    }

    product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  })
);

// Delete product
router.delete("/delete-shop-product/:id", isSeller, catchAsyncError(async (req, res, next) => {
  const productId = req.params.id;

  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    return next(new ErrorHandler('Product not found with this id!', 404));
  }

  product.images.forEach((imageUrl) => {
    const filename = imageUrl.public_id;
    const filepath = path.join(__dirname, '../uploads', filename);

    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully!",
  });
}));

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
