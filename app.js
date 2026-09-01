const express=require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
//review import
const Review = require("./models/review.js");
//routes
 const listingRouter=require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
//uploads/ publicly servable, same way public/ already is:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  . then(()=>{
      console.log("Connected to DB");
  })
  .catch((err)=>{
     console.log(err);
  })


//Use EJS for rendering pages and look for those pages inside views.
app.set("view engine","ejs");
app.set("view ",path.join(__dirname,"views"));
// middleware allows Express to understand data submitted from new.ejs.
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);



// Catch-all for undefined routes
app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Main error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

/* Server setup */
app.listen(8080,()=>{
console.log("Server is listening to the port 8080")
})