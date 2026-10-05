const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    // 1. Who is booking the room? (Connects to your User model)
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    // 2. Which room are they booking? (Connects to your Listing model)
    listing: { 
        type: Schema.Types.ObjectId, 
        ref: 'Listing',
        required: true
    },
    // 3. Payment Details (To prove they actually paid)
    razorpay_order_id: String,
    razorpay_payment_id: String,
    amount: Number,
    
    // 4. Booking Status
    status: { 
        type: String, 
        default: 'Confirmed' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);