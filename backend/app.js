require('dotenv').config(); // Make sure this line is at the top

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const ErrorHandler = require('./utils/ErrorHandler');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use("/", express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/couponCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversations");
const message = require("./controller/messages");
const withdraw = require("./controller/withdraw");

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/api/v2/withdraw", withdraw);




// Error handling middleware should be added last
app.use((err, req, res, next) => {
  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;
