const User = require("../models/user.js");

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const regitseredUser = await User.register(newUser, password);
        console.log(regitseredUser);
        req.login(regitseredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
module.exports.RendersignupForm = (req, res) => {
    res.render("users/signup.ejs");
};
module.exports.RenderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
};
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are looged out successfully!");
        res.redirect("/listings");
    });
};