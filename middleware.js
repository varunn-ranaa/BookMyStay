const Listing = require('./models/listing.js');
const Review = require('./models/review.js')
const {listingSchema, revSchema} =  require('./schemaValidation.js');

module.exports.LoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must log in first !");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner[0].equals(res.locals.currUser._id)){
      req.flash("error"," No User Authorization !");
      return res.redirect(`/listing/${id}`);
    }
    next();
}

//listing Validation
module.exports.listingValidation = (req,res,next)=>{
  let data = req.body;

  let {value , error } = listingSchema.validate(data)
  if(error){
    let errMsg =  error.details.map(el => el.message).join(",");
    throw new ExpressError(400,error.message);
  }
  else{
    next();
  }
}

//reviews validation
module.exports.reviewValidation = (req,res,next)=>{
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

module.exports.isReviewOwner = async (req,res,next)=>{
    let {id,rid} = req.params;
    let review = await Review.findById(rid);

    if(!review.owner.equals(res.locals.currUser._id)){
      req.flash("error"," No User Authorization !");
      return res.redirect(`/listing/${id}`);
    }
    next();
}
