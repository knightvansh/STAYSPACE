require("dotenv").config();
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
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

//require express session//
const session=require("express-session");
const { MongoStore } = require("connect-mongo");

const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
// requires the model with Passport-Local Mongoose plugged in
const User = require('./models/user');


//review import
const Review = require("./models/review.js");
//routes
const listingRouter=require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const  userRouter = require("./routes/user.js");
const dbUrl=process.env.ATLASDB_URL;


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


async function main(){
   await mongoose.connect(dbUrl);
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
app.set("views",path.join(__dirname,"views"));
// middleware allows Express to understand data submitted from new.ejs.
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//express -session Initialization and using 

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
      secret:"process.env.SECRET",
  },
 touchAfter:24*3600,
})

store.on("error",()=>{
   console.log("ERROR IN MONGO SESSION STORE",err);
})


const  sessionOptions={
  store,
  secret:"process.env.SECRET",
  resave:false, 
  saveUninitialized: true,
  cookie:{
        expire:Date.now()+7*24*60*60*10000,
        maxAge:7*24*60*60*10000,
        // if both expires and maxAge are set in the options, then the maxage defined in the object is what is used.
        httpOnly:true,
  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   res.locals.error = req.flash("error");
  next();
});

// Express  Router 
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Catch-all for undefined routes
app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Main error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});


 app.get("/",(req,res)=>{
      console.log("vansh");
 });
// 
/* Server setup */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
