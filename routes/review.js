const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js')
const {revSchema} =  require('../schemaValidation.js');

//reviews validation
function reviewValidation(req,res,next){
   let {value, error} = revSchema.validate(req.body);
   if(error){
    console.log(error);
     let errMsg = error.details.map(el => el.message).join(",");
     throw new ExpressError(400,errMsg);
   }
   else{
    next();
   }
}

//:Post route
router.post("/",reviewValidation,wrapAsync(async(req,res)=>{
   let {id} = req.params;
   let data = req.body;
   let rev = await new Review(data.review);
   let newReview = await rev.save();
    
   let list = await Listing.findById(id);
   list.review.push(newReview);
   list.save();
   req.flash("success","Review Added !");
   console.log("New Review saved !");
   res.redirect(`/listing/${id}`);
  })
);

//:Delete review route
router.delete("/:rid",wrapAsync(async(req,res)=>{
  let {id,rid} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {review : rid}});
  await Review.findByIdAndDelete(rid);
  req.flash("success","Review Deleted !");
  res.redirect(`/listing/${id}`);
}));

module.exports = router;