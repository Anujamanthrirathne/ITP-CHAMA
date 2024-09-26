const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;

      // Log the received amount
      console.log("Received amount:", amount);

      // Validate amount
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
      }

      // Create PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd', // Ensure currency is supported and correctly set
        metadata: { company: 'Becodemy' },
      });

      res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Stripe Payment Error:", error); // Log the error
      res.status(500).json({ success: false, message: error.message });
    }
  })
);




router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);



module.exports = router;