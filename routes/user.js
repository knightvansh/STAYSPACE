//  const { savedRedirectUrl } = require("../utils/middleware.js");
 express=require("express");
 const router = express.Router();
 const User = require("../models/user.js");
 const passport = require("passport");
const userController =require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
 // Show signup page
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Handle signup form //post signup
router.post("/signup", 
   wrapAsync(userController.signup),
);


// GET login page
  router.get("/login", (req, res) => { 
    console.log("GET login:", req.session.redirectUrl);

    res.render("users/login.ejs");
});



  //post login page//
router.post
( "/login",
        // savedRedirectUrl,
     passport.authenticate("local",{
          failureRedirect: "/login", 
          failureFlash: true 
        }),
          (req, res) => {
            console.log("LOGIN USER:", req.user);

             const redirectUrl =  "/listings";

            req.flash("success", "Welcome back to STAYSPACE!");
             res.redirect(redirectUrl);
 } );



//logout
 router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
});
module.exports = router;