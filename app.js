const express=require("express");
const app = express();
const cors = require("cors");
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");

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


app.get("/",(req,res)=>{
  res.send("hi,i am vansh");
}
);


//Index Route
app.get("/listings",  wrapAsync(async(req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
})
);

//new route
app.get("/listings/new",  wrapAsync(async(req, res) => {
  res.render("listings/new.ejs");
})
);

//show routes
app.get("/listings/:id",  wrapAsync(async(req, res) =>{
        let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
 })
);
   
//Create route
  app.post("/listings", 
    wrapAsync(async(req, res,next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
})
);


//Edit Route
app.get("/listings/:id/edit",  wrapAsync(async(req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
})
);

//Update Route
app.put("/listings/:id",  wrapAsync(async(req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
})
);

//Delete Route
app.delete("/listings/:id",  wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
})
);





//  app.get("/testListing  ",async(req,res)=>{
//   let sampleListing=new Listing({
//     title:"My new villa ",
//     description :"By the beach ",
//     price:1200,
//     location:"goa",
//   });
//    await sampleListing.save();
//  console.log("sample was saved ");
// res.send("successful testing" );
// });

// Catch-all for undefined routes
app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Main error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080,()=>{
console.log("Server is listening to the port 8080")
})