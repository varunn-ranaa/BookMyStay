const express = require('express');
const router = express.Router({});
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js');
const { userSchemaValidation } = require('../schemaValidation.js');
const ExpressError = require('../utils/expressError.js');
const passport = require('passport');
const { saveRedirect, LoggedIn } = require('../middleware.js');
const { registerForm, userRegister, loginPage, userLogin, userLogout } = require('../controllers/user.js');

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


router.get("/register", registerForm)

router.post("/register", userValidation, saveRedirect, wrapAsync(userRegister));

router.get("/login", loginPage)

router.post("/login", saveRedirect, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), userLogin)

router.get("/logout", userLogout)

module.exports = router 