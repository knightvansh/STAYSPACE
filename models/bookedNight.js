const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookedNightSchema = new Schema({
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    booking: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    expiresAt: Date,
});

bookedNightSchema.index({ listing: 1, date: 1 }, { unique: true });
bookedNightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('BookedNight', bookedNightSchema);
