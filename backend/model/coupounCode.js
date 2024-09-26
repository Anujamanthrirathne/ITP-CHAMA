const mongoose = require("mongoose");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

const coupounCodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your coupon code name!"],
        unique: true,
    },
    value: {
        type: Number,
        required: true,
    },
    minAmount: {
        type: Number,
    },
    maxAmount: {
        type: Number,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for referencing
        ref: "Shop",                           // Reference the Shop model
        required: true,
    },
    selectedProduct: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});



module.exports = mongoose.model("CoupounCode", coupounCodeSchema);
