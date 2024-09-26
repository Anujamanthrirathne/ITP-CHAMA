
const express = require("express");
const mongoose = require("mongoose");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const { upload } = require("../multer");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const fs = require("fs");
const path = require("path");
// Create event
router.post(
  "/create-event",
  upload.array("images"),
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      if (!mongoose.Types.ObjectId.isValid(shopId)) {
        return next(new ErrorHandler("Invalid Shop ID format!", 400));
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found!", 404));
      }

      const files = req.files;
      if (!files || files.length === 0) {
        return next(new ErrorHandler("No images uploaded!", 400));
      }

      const imageUrls = files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));

      const eventData = req.body;
      eventData.images = imageUrls;
      eventData.shop = shop._id;

      const event = await Event.create(eventData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      console.error("Error in creating event:", error.message);
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

// Route to get all products of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncError(async (req, res, next) => {
    const events = await Event.find({ shopId: req.params.id });
    res.status(200).json({
      success: true,
      events,
    });
  })
);

// get all events
router.get(
  "/get-all-events",
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find();
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

// Delete product of a shop
router.delete(
  "/delete-shop-event/:id",
  catchAsyncError(async (req, res, next) => {
    const productId = req.params.id;

    // Find the event
    const eventData = await Event.findById(productId);
    if (!eventData) {
      return next(new ErrorHandler("Event not found with this id!", 404));
    }

    // Delete images
    for (const image of eventData.images) {
      const filename = path.basename(image.url); // Extract filename from URL
      const filepath = path.join(__dirname, "../uploads", filename);

      console.log(`Attempting to delete file: ${filepath}`);

      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error(`File does not exist: ${filepath}`);
        } else {
          fs.unlink(filepath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filename}:`, err);
            } else {
              console.log(`Successfully deleted file ${filename}`);
            }
          });
        }
      });
    }

    // Delete the event
    await Event.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Event Deleted Successfully!",
    });
  })
);

// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


module.exports = router;
