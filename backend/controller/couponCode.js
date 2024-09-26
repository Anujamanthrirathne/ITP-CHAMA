const express = require("express");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const { isSeller } = require("../middleware/auth");
const CouponCode = require("../model/coupounCode");
const coupounCode = require("../model/coupounCode");

// Create coupon code
router.post(
  "/create-coupon-code",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      console.log("Request body:", req.body); // Log request body

      const isCouponCodeExists = await CouponCode.findOne({
        name: req.body.name,
      });

      console.log("Existing coupon codes:", isCouponCodeExists); // Log existing coupon codes

      if (isCouponCodeExists) {
        return next(new ErrorHandler("Coupon code already exists!", 400));
      }

      const couponCode = await CouponCode.create(req.body);

      res.status(201).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      console.error("Error creating coupon:", error); // Log errors
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Get all coupons of a shop
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCodes = await CouponCode.find({ shopId: req.params.id });

      res.status(200).json({
        success: true,
        couponCodes,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// delete coupoun code of a shop
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get coupon code value by its name
router.get(
  "/get-coupon-value/:name",
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);


module.exports = router;
