const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const reviewController=require("../controllers/review.js")

// Post Review Route
router.post("/",
   wrapAsync(reviewController.postreview));

// Delete Review .
router.delete("/:reviewId", 
  wrapAsync(reviewController.destroyReview));

module.exports = router;