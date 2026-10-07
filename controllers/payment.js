

const crypto = require('crypto');
const Booking = require('../models/booking');
const Listing = require('../models/listing'); 
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


module.exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Frontend se amount le raha hai
        const options = {
            amount: amount * 100, // Paise mein convert karne ke liye
            currency: "INR",
            receipt: "receipt_booking_" + Date.now(),
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, order });
       } 
        catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating order" });
    } 
   };


   module.exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature , listingId} = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // 2. Compare our signature with Razorpay's signature
        if (razorpay_signature === expectedSign) {
            const newBooking = new Booking({
                user: req.user._id,        // From Passport session
                listing: listingId,        // From Frontend
                razorpay_order_id: razorpay_order_id,
                razorpay_payment_id: razorpay_payment_id,
                amount: 1000                // Storing the price
            });
            
            await newBooking.save(); // Save to MongoDB!
            console.log("Booking saved to Database!");
            // console.log("Payment successfully verified by backend!");
            // (In, we will save this to MongoDB here
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        } else {
            console.log("Fake Payment Detected!");
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Verification error" });
    }
};
