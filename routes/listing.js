
 const express=require("express");
 const router = express.Router();
 exports.router = router;
 const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
// Multer storage config — keeps the file extension, unlike the old dest-only setup
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Not wired into any route yet — fix signature if/when you use it as middleware
const validateListing=(req, res, next)=>{
 let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();

};

  
//Index Route -Show all listings/Just displays data
 router.get("/",  wrapAsync(async(req, res) => {
  const allListings = await Listing.find({});
   res.render("listings/index.ejs", { allListings });
 })
 );

 //new route-Displays an HTML form, nothing saved yet
 router.get("/new",  wrapAsync(async(req, res) => {
   res.render("listings/new.ejs");
 })
 );

// //show routes-Show one listing/just display data
router.get("/:id",  wrapAsync(async(req, res) =>{
         let { id } = req.params;
     const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
 })
 );
   
////Create route-Process that form's submission/Takes what the user typed, saves a new document to MongoDB
  router.post("/", upload.single("listing[image]"), wrapAsync(async (req, res) => {
  console.log(req.body);   // add this temporarily to see it work
  console.log(req.file);   // this will show your uploaded file's info
  const newListing = new Listing(req.body.listing);
   newListing.image = {
     url: "/uploads/" + req.file.filename,
  filename: req.file.filename,
  };
  await newListing.save();
  console.log(newListing);
  res.redirect("/listings");
}));


// //Edit Route-Show a pre-filled form/Displays a form with the existing listing's data already in the fields
 router.get("/:id/edit",  wrapAsync(async(req, res) => {
  let { id } = req.params;
   const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
})
);

// //Update Route-Process that edit form's submission/Takes the edited data, saves changes to the existing document
  router.put("/:id",upload.single("listing[image]"), 
   wrapAsync(async(req, res) => {
  let { id } = req.params;
   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   res.redirect(`/listings/${id}`);
 })
 );

// //Delete Route-Remove a listing/Deletes the document
 router.delete("/:id",  wrapAsync(async (req, res) => {
   let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
 })
 );

 module.exports = router;