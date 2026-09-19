//  const { savedRedirectUrl } = require("../utils/middleware.js");
 express=require("express");
 const router = express.Router();
 const User = require("../models/user.js");
 const passport = require("passport");
const userController =require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
 // Show signup page
router.get("/signup",userController.rendersignup );

// Handle signup form //post signup
router.post("/signup", 
   wrapAsync(userController.signup),
);

// GET login page
  router.get("/login", userController.renderlogin);

  //post login page//
router.post
( "/login",
     passport.authenticate("local",{
          failureRedirect: "/login", 
          failureFlash: true 
        }),
  userController.postlogin
 );



//logout 
router.post("/logout",userController.logout);
module.exports = router;