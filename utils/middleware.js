const ExpressError = require("./ExpressError.js");

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
 console.log("Original URL:", req.originalUrl);
  req.session.redirectUrl = req.originalUrl;
 console.log("Saved redirect URL:", req.session.redirectUrl);

 req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};


//  module.exports.savedRedirectUrl=(req,res,next)=>{
//    if(req.session.redirectUrl){
//     res.locals.redirectUrl=req.session.redirectUrl;
//    }
//    next();
//  };



module.exports = { isLoggedIn  };