const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');

const {LoggedIn, isOwner , listingValidation} = require('../middleware.js');
const { equal } = require('joi');

const listingController = require('../controllers/listing.js')


//All Listings
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",LoggedIn,listingController.renderNewForm);

//show route 
router.get("/:id", wrapAsync(listingController.showListing));

//New Listings
router.post("/",listingValidation,LoggedIn,wrapAsync(listingController.newListing));

router.get("/:id/edit",LoggedIn,isOwner,wrapAsync(listingController.editForm));


//Edit Listings
router.patch("/:id",listingValidation,LoggedIn,isOwner,wrapAsync(listingController.editListing));


//Delete Listings
router.delete("/:id",LoggedIn,isOwner,wrapAsync(listingController.deleteListing))

module.exports = router ; 