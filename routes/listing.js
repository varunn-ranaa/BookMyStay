const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');

const {LoggedIn, isOwner , listingValidation, saveRedirect} = require('../middleware.js');
const { equal } = require('joi');

const listingController = require('../controllers/listing.js')

router.route("/")
.get(wrapAsync(listingController.index)) //All Listings
.post(listingValidation,LoggedIn,wrapAsync(listingController.newListing));//New Listings

//new route
router.get("/new",LoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing)) //show route 
.patch(listingValidation,LoggedIn,isOwner,wrapAsync(listingController.editListing)) //Edit Listings
.delete(LoggedIn,isOwner,wrapAsync(listingController.deleteListing))//Delete Listings

router.get("/:id/edit",LoggedIn,isOwner,wrapAsync(listingController.editForm));


module.exports = router ; 