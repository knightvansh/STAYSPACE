
const User=require("../models/user");



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