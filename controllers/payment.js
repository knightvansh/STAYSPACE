// console.log("My Key ID is:", process.env.RAZORPAY_KEY_ID); // <-- ये लाइन डाल
const Razorpay = require('razorpay');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const BookedNight = require('../models/bookedNight');
const Listing = require('../models/listing'); 
const { getBookingDates } = require('../utils/bookingDates');
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


module.exports.createOrder = async (req, res) => {
    try {
        const { listingId, checkIn: checkInValue, checkOut: checkOutValue } = req.body;
        if (!mongoose.isValidObjectId(listingId)) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }

        const requestedDates = getBookingDates(checkInValue, checkOutValue);
        if (requestedDates.error) {
            return res.status(400).json({ success: false, message: requestedDates.error });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        if (!Number.isFinite(listing.price) || listing.price <= 0) {
            return res.status(400).json({ success: false, message: "Listing price is invalid" });
        }

        const amount = Math.round(listing.price * requestedDates.nights * 100);
        if (!Number.isSafeInteger(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: "Booking amount is invalid" });
        }

        const options = {
            amount,
            currency: "INR",
            receipt: "receipt_booking_" + Date.now(),
        };

        await BookedNight.init();
        const order = await razorpay.orders.create(options);

        const now = new Date();
        const holdExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const expiredReservations = await BookedNight.find({
                    listing: listing._id,
                    date: { $in: requestedDates.nightDates },
                    expiresAt: { $lte: now },
                }).select('_id booking').session(session);
                const expiredBookingIds = [
                    ...new Set(expiredReservations.map((reservation) => reservation.booking.toString())),
                ].map((id) => new mongoose.Types.ObjectId(id));

                if (expiredReservations.length) {
                    await BookedNight.deleteMany(
                        { _id: { $in: expiredReservations.map((reservation) => reservation._id) } },
                        { session }
                    );
                    await Booking.updateMany(
                        { _id: { $in: expiredBookingIds }, status: "PENDING_PAYMENT" },
                        { $set: { status: "CANCELLED" } },
                        { session }
                    );
                }

                const [booking] = await Booking.create([{
                    user: req.user._id,
                    listing: listing._id,
                    checkIn: requestedDates.checkIn,
                    checkOut: requestedDates.checkOut,
                    holdExpiresAt,
                    razorpay_order_id: order.id,
                    amount: amount / 100,
                    status: "PENDING_PAYMENT",
                }], { session });

                await BookedNight.insertMany(
                    requestedDates.nightDates.map((date) => ({
                        listing: listing._id,
                        booking: booking._id,
                        date,
                        expiresAt: holdExpiresAt,
                    })),
                    { session }
                );
            });
        } finally {
            await session.endSession();
        }

        res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
            checkIn: checkInValue,
            checkOut: checkOutValue,
            nights: requestedDates.nights,
        });
       } 
        catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Those dates are already booked" });
        }
        if (error.code === 20 || error.codeName === "IllegalOperation") {
            return res.status(503).json({
                success: false,
                message: "Date reservations require MongoDB replica-set transactions",
            });
        }
        res.status(500).json({ success: false, message: "Error creating order" });
    } 
   };


   module.exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (
            typeof razorpay_order_id !== "string" ||
            typeof razorpay_payment_id !== "string" ||
            typeof razorpay_signature !== "string" ||
            !/^[a-f0-9]{64}$/i.test(razorpay_signature)
        ) {
            return res.status(400).json({ success: false, message: "Invalid payment response" });
        }

        const booking = await Booking.findOne({
            razorpay_order_id,
            user: req.user._id,
        });
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        if (booking.status === "CONFIRMED") {
            if (booking.razorpay_payment_id === razorpay_payment_id) {
                return res.status(200).json({ success: true, message: "Payment already verified" });
            }
            return res.status(409).json({ success: false, message: "Booking already confirmed" });
        }
        if (booking.status !== "PENDING_PAYMENT") {
            return res.status(409).json({ success: false, message: "Booking is not awaiting payment" });
        }
        if (!booking.holdExpiresAt || booking.holdExpiresAt <= new Date()) {
            return res.status(409).json({ success: false, message: "The booking hold has expired" });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        const providedSignature = Buffer.from(razorpay_signature, "hex");
        const expectedSignature = Buffer.from(expectedSign, "hex");
        if (!crypto.timingSafeEqual(providedSignature, expectedSignature)) {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }

        const order = await razorpay.orders.fetch(razorpay_order_id);
        if (
            order.amount !== Math.round(booking.amount * 100) ||
            order.currency !== "INR"
        ) {
            return res.status(400).json({ success: false, message: "Payment amount mismatch" });
        }

        const session = await mongoose.startSession();
        let confirmed = false;
        try {
            await session.withTransaction(async () => {
                const currentBooking = await Booking.findOne({
                    _id: booking._id,
                    user: req.user._id,
                    status: "PENDING_PAYMENT",
                    holdExpiresAt: { $gt: new Date() },
                    $or: [
                        { razorpay_payment_id: { $exists: false } },
                        { razorpay_payment_id: null },
                    ],
                }).session(session);
                if (!currentBooking) {
                    return;
                }

                const expectedNights = (currentBooking.checkOut.getTime() - currentBooking.checkIn.getTime())
                    / (24 * 60 * 60 * 1000);
                const reservedNights = await BookedNight.countDocuments({
                    booking: currentBooking._id,
                }).session(session);
                if (reservedNights !== expectedNights) {
                    throw new Error("Booking night reservations are incomplete");
                }

                const confirmedBooking = await Booking.findOneAndUpdate(
                    {
                        _id: currentBooking._id,
                        user: req.user._id,
                        status: "PENDING_PAYMENT",
                        holdExpiresAt: { $gt: new Date() },
                    },
                    {
                        $set: {
                            razorpay_payment_id,
                            status: "CONFIRMED",
                        },
                    },
                    { session, returnDocument: "after", runValidators: true }
                );

                if (!confirmedBooking) {
                    return;
                }

                const releasedExpiry = await BookedNight.updateMany(
                    { booking: currentBooking._id },
                    { $unset: { expiresAt: 1 } },
                    { session }
                );
                if (releasedExpiry.matchedCount !== expectedNights) {
                    throw new Error("Booking night reservations could not be confirmed");
                }
                confirmed = true;
            });
        } finally {
            await session.endSession();
        }

        if (confirmed) {
            return res.status(200).json({ success: true, message: "Payment verified successfully" });
        }

        const latestBooking = await Booking.findOne({
            razorpay_order_id,
            user: req.user._id,
        });
        if (
            latestBooking?.status === "CONFIRMED" &&
            latestBooking.razorpay_payment_id === razorpay_payment_id
        ) {
            return res.status(200).json({ success: true, message: "Payment already verified" });
        }
        return res.status(409).json({ success: false, message: "Booking could not be confirmed" });
    } 
    catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "Payment has already been used" });
        }
        if (error.code === 20 || error.codeName === "IllegalOperation") {
            return res.status(503).json({
                success: false,
                message: "Date reservations require MongoDB replica-set transactions",
            });
        }
        res.status(500).json({ success: false, message: "Verification error" });
    }
};
