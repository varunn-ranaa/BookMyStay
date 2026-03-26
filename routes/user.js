const express = require('express');
const router = express.Router({});
const User = require('../models/user.js')
const wrapAsync = require('../utils/wrapAsync.js');
const { userSchemaValidation } = require('../schemaValidation.js');
const ExpressError = require('../utils/expressError.js');

function userValidation(req, res, next) {

    let data = req.body;

    let { value, error } = userSchemaValidation.validate(data);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        console.log(errMsg);
        req.flash("error",errMsg);
        return res.redirect("/register");
    }
    else {
        next();
    }
}


router.get("/register", (req, res) => {
    res.render("users/signUp.ejs", { showNavbar: false });
})

router.post("/register", userValidation, wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        await User.register(newUser, password)
        console.log("User Registered !");
        req.flash("success", "User Registered successfully !");
        res.redirect("/listing");
    } catch (e) {
        req.flash("error", e.message);
        console.log(e.message);
        res.redirect("/register");
    }
}));

module.exports = router 