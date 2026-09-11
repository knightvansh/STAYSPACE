 const cloudinary = require("../utils/cloudinary.js");
 const express=require("express");
 const router = express.Router();
 exports.router = router;
 const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
// Multer storage config — keeps the file extension, unlike the old dest-only setup
const multer = require("multer");
// const path = require("path");
const { isLoggedIn } = require("../utils/middleware.js");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Not wired into any route yet — fix signature if/when you use it as middleware
const validateListing=(req, res, next)=>{
 let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();

};
const ListingController=require("../controllers/listing.js")


//Index Route -Show all listings-Just displays data
 router.get("/",  wrapAsync(ListingController.index) );

 //new route-Displays an HTML form -nothing saved yet
 router.get("/new",isLoggedIn,ListingController.renderNewForm  );

 //show routes-Show one listing-just display data
router.get("/:id",  wrapAsync(ListingController.ShowListing));
   
//Create route-Process that form's submission/Takes what the user typed, saves a new document to MongoDB
   router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
      wrapAsync(ListingController.CreateNewForm)
  );


// //Edit Route-Show a pre-filled form/Displays a form with the existing listing's data already in the fields
 router.get(
  "/:id/edit",
  isLoggedIn,
   wrapAsync(ListingController.EditNewForm)
);

// //Update Route-Process that edit form's submission/Takes the edited data, saves changes to the existing document
  router.put(
    "/:id",
    isLoggedIn,
    upload.single("listing[image]"), 
   wrapAsync(ListingController.UpdateNewForm )
 );

// //Delete Route-Remove a listing/Deletes the document
 router.delete(
  "/:id", 
  isLoggedIn, 
  wrapAsync(ListingController.DestroyListing)
 );

 module.exports = router;