
const User=require("../models/user");

module.exports.rendersignup = (req, res) => {
    res.render("users/signup.ejs");
};

// Handle signup form //post signup//
module.exports.signup=async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({
            username: username,
            email: email
        });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=> {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to STAYSPACE!");
            res.redirect("/listings");
        });
    }
    catch (err) {
         req.flash("error", err.message);
        res.redirect("/signup");
    }
};

 module.exports.renderlogin = (req, res) => { 
    console.log("GET login:", req.session.redirectUrl);
    res.render("users/login.ejs");
};


  module.exports.postlogin = (req, res) => { 
            // console.log("LOGIN USER:", req.user);//
            const redirectUrl =  "/listings";
            req.flash("success", "Welcome back to STAYSPACE!");
            res.redirect(redirectUrl);
 };


module.exports.logout= (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
};