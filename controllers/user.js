const User = require('../models/user.js')

module.exports.registerForm = (req, res) => {
    res.render("users/signUp.ejs", { showNavbar: false , returnTo: req.session.returnTo || ""});
}

module.exports.userRegister = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        
        // Passport-local-mongoose handles hashing and saving
        const registeredUser = await User.register(newUser, password);

        // Automatically log in the user after registration
        req.login(registeredUser, (err) => {
            if (err) return next(err); // Pass the error to the handler
            
            req.flash("success", "User Registered successfully!");
            let redirectUrl = res.locals.redirectUrl || "/listing";
            res.redirect(redirectUrl);
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};


module.exports.loginPage = (req, res) => {
    res.render("users/login.ejs", { showNavbar: false, returnTo: req.session.returnTo || "" });
}

module.exports.userLogin = async (req, res) => {
    req.flash("success", "User Login Successful !");
    let redirect = res.locals.redirectUrl || "/listing";
   
    res.redirect(redirect);

}

module.exports.userLogout = (req, res, next) => {

    let redirectUrl = req.get('Referer') || "/listings";

    req.logout((err) => {
        if (err) {
            return next()
        }
        req.flash("success", "User Logout successfully !");
        res.redirect("/listing");
    })
}