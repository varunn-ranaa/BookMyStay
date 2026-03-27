module.exports.LoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "you must log in first !");
        return res.redirect("/login");
    }
    next();
}