const express = require('express');
const router = express.Router({});
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js');
const { userSchemaValidation } = require('../schemaValidation.js');
const ExpressError = require('../utils/expressError.js');
const passport = require('passport');
const { saveRedirect, LoggedIn } = require('../middleware.js');

function userValidation(req, res, next) {

    let data = req.body;

    let { value, error } = userSchemaValidation.validate(data);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        console.log(errMsg);
        req.flash("error", errMsg);
        return res.redirect("/register");
    }
    else {
        next();
    }
}


router.get("/register", (req, res) => {
    res.render("users/signUp.ejs", { showNavbar: false });
})

router.post("/register", userValidation, LoggedIn, saveRedirect, wrapAsync(async (req, res) => {
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
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs", { showNavbar: false });
})

router.post("/login", LoggedIn, saveRedirect, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), async (req, res) => {
    req.flash("success", "User Login Successful !");
    let redirect = res.locals.redirectUrl || "/listing"
    res.redirect(redirect);

})

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next()
        }
        req.flash("success", "User Logout successfully !");
        res.redirect("/listing");
    })
})

module.exports = router 