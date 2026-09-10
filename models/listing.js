const mongoose=require("mongoose");// Importing/Requiring mongoose from package.
const Schema = mongoose.Schema; 

const listingSchema =new mongoose .Schema({
 title:{
    type:String,
    required:true,
    },
description:String,
image:{
    url: String,
    filename: String,
},

price: Number,
location:String,
country:String,
reviews: [
    { type: Schema.Types
        .ObjectId, ref: "Review" }
],
owner: { type: Schema.Types.ObjectId, 
    ref: "User" },
});


// Post Mongoose Middleware
// listingSchema.post("findOneAndDelete", async (listing) => {
//     if (listing) {
//         await Review.deleteMany({ _id: { $in: listing.reviews } });
//     }
// });


/* Model creating and exporting */
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
// This gives you the Listing /.zxx.
// You import it into app.js: