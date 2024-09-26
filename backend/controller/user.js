const express = require("express");
const path = require("path");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../model/user");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");
const mongoose = require('mongoose');

// Create User Route
router.post(
  "/create-user",
  upload.single("file"),
  catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      if (req.file) {
        const filename = req.file.filename;
        const filepath = path.join("uploads", filename); // Use path.join for cross-platform compatibility
        fs.unlink(filepath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return res.status(500).json({ message: "Error deleting file" });
          }
        });
      }
      return next(new ErrorHandler("User already exists", 400));
    }

    // Handle file upload
    const filename = req.file ? req.file.filename : null;
    const fileUrl = filename ? path.join("uploads", filename) : null;

    // Create new user object
    const user = {
      name,
      email,
      password,
      avatar: {
        public_id: filename,
        url: fileUrl,
      },
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    console.log(`Activation URL: ${activationUrl}`); // Log the activation URL

    try {
      await sendMail({
        email: user.email,
        subject: "Activate Your Account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });

      console.log("Email sent successfully");

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return next(new ErrorHandler("Failed to send activation email", 500));
    }
  })
);

// Create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Activate User Route
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    const { activation_token } = req.body;

    try {
      const user = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

      if (!user) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { name, email, password, avatar } = user;

      let existingUser = await User.findOne({ email });

      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const newUser = await User.create({
        name,
        email,
        password, // Ensure this password is hashed before saving
        avatar,
      });

      console.log("User activated successfully:", newUser);

      sendToken(newUser, 201, res);
    } catch (error) {
      console.error("Error activating user:", error);
      return next(new ErrorHandler("Invalid or expired token", 400));
    }
  })
);

// Login User Route
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide all fields!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User doesn't exist!", 400));
    }

    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return next(new ErrorHandler("Please provide correct information!", 400));
    }

    sendToken(user, 201, res);
  })
);

// Load User Route
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exist!", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// Log out user
router.get(
  "/logout",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;

      // Find the user by email
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Check if the provided password is correct
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      // Update user details
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber; // Make sure to update with the provided phone number

      // Save the updated user details
      await user.save();

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncError(async (req, res, next) => {
    try {
      const existingUser = await User.findById(req.user.id);

      // Assuming avatar is an object with { public_id, url }
      if (existingUser.avatar && existingUser.avatar.url) {
        const existAvatarPath = path.join(
          __dirname,
          "../",
          existingUser.avatar.url
        );

        // Check if file exists before trying to delete
        if (fs.existsSync(existAvatarPath)) {
          fs.unlinkSync(existAvatarPath); // Safely remove the old avatar
        }
      }

      // Save the new avatar
      const fileUrl = `uploads/${req.file.filename}`;
      const avatarData = {
        public_id: req.file.filename,
        url: fileUrl,
      };

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: avatarData },
        { new: true }
      );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update user address
router.put(
  "/update-user-address",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      // Check if the addressType already exists
      const sameTypeAddress = user.addresses.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return res.status(400).json({
          success: false,
          message: `${req.body.addressType} address already exists`,
        });
      }

      const existsAddress = user.addresses.find(
        (address) => address._id === req.body._id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        user.addresses.push(req.body);
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: "Address updated successfully!",
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user._id;
      const addressId = req.params.id;

      // Validate if addressId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return next(new ErrorHandler("Invalid address ID", 400));
      }

      // Remove the address from the user's addresses array
      await User.updateOne(
        { _id: userId },
        { $pull: { addresses: { _id: addressId } } }
      );

      // Fetch the updated user
      const user = await User.findById(userId);

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new ErrorHandler("All fields are required!", 400));
      }

      const user = await User.findById(req.user.id).select("+password");

      const isPasswordMatched = await user.comparePassword(oldPassword);

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect!", 400));
      }

      if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match!", 400));
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user information with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const users = await User.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(
          new ErrorHandler("User is not available with this id", 400)
        );
      }

      // const imageId = user.avatar.public_id;

      // await cloudinary.v2.uploader.destroy(imageId);

      await User.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




module.exports = router;
