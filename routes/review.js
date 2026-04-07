const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js')
const {revSchema} =  require('../schemaValidation.js');
const {LoggedIn, reviewValidation, saveRedirect,  isReviewOwner} = require('../middleware.js');
const { addReview, deleteReview } = require('../controllers/review.js');



//:Post route
router.post("/",LoggedIn,reviewValidation,saveRedirect,wrapAsync(addReview)
);

//:Delete review route
router.delete("/:rid",LoggedIn,isReviewOwner,saveRedirect,wrapAsync(deleteReview));

module.exports = router;