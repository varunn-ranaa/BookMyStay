const Listing = require('../models/listing.js');
const Review = require('../models/review.js')

module.exports.addReview = async(req,res)=>{
   let {id} = req.params;
   let data = req.body;
   let rev = await new Review(data.review);
   if(!res.locals.currUser){
     req.flash("error","Login first !");
     return res.redirect("/login");
   }
   rev.owner = req.user._id;
   let newReview = await rev.save();
    
   let list = await Listing.findById(id);
   list.review.push(newReview);
   list.save();
   req.flash("success","Review Added !");
   console.log("New Review saved !");
   res.redirect(`/listing/${id}`);
  }

  module.exports.deleteReview = async(req,res)=>{
  let {id,rid} = req.params;
  await Listing.findByIdAndUpdate(id,{$pull : {review : rid}});
  await Review.findByIdAndDelete(rid);
  req.flash("success","Review Deleted !");
  res.redirect(`/listing/${id}`);
}