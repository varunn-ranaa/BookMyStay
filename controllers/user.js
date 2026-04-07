const User = require('../models/user.js')

module.exports.registerForm = (req, res) => {
    res.render("users/signUp.ejs", { showNavbar: false });
}

module.exports.userRegister = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        await User.register(newUser, password)
        console.log("User Registered !");
        req.login(newUser, (err) => {
            if (err) {
                return next();
            }
            req.flash("success", "User Registered successfully !");
            let redirect = res.locals.redirectUrl || "/listing"
            res.redirect(redirect);
        })
    } catch (e) {
        req.flash("error", e.message);
        console.log(e.message);
        res.redirect("/register");
    }
}

module.exports.loginPage = (req, res) => {
    res.render("users/login.ejs", { showNavbar: false });
}

module.exports.userLogin = async (req, res) => {
    req.flash("success", "User Login Successful !");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect);

}

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next()
        }
        req.flash("success", "User Logout successfully !");
        res.redirect("/listing");
    })
}