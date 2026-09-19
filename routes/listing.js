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



// 2. Root Routes (Index & Create)
router
.route("/")
 .get( wrapAsync(ListingController.index))
 .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.CreateNewForm)
  );

  router.get("/new",isLoggedIn,ListingController.renderNewForm  );

// 3. Edit Form Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(ListingController.EditNewForm)
);

// 4. Parameterized ID Routes (Show, Update, Delete)
router
.route("/: ")
 .get (wrapAsync(ListingController.ShowListing))
 .put(
    isLoggedIn,
    upload.single("listing[image]"), 
   wrapAsync(ListingController.UpdateNewForm )
 )
 .delete(
  isLoggedIn, 
  wrapAsync(ListingController.DestroyListing)
 );
 

 module.exports = router;