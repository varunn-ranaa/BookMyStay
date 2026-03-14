const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/expressError.js');
const {listingSchema} = require('../schemaValidation.js');

//listing validation 
function listingValidation(req,res,next){
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

//All Listings
router.get("/",wrapAsync(async (req,res)=>{  
  const lists =  await Listing.find({});
  res.render("listings/index.ejs",{lists});
}));

router.get("/new",(req,res)=>{  
    res.render("listings/new.ejs");
});

//show route 
router.get("/:id", wrapAsync(async (req,res)=>{
   let {id} = req.params;
   let list = await Listing.findById(id).populate("review");
   
  if(!list){
    req.flash("error"," Listing does not found !");
    return res.redirect("/listing");
   }
  res.render("listings/show.ejs",{list});
}));

//New Listings
router.post("/",listingValidation,wrapAsync(async (req,res)=>{ 

  let data  = req.body.listing;

  let newList = new Listing(data);
  console.log(newList);

  await newList.save();
  req.flash("success"," New Listing Added !");
  res.redirect("/listing");
}));

router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
  if(!list){
  req.flash("error","Listing not found!");
  return res.redirect("/listing");
  }    
    res.render("listings/edit.ejs",{list});
}));



//Edit Listings
router.patch("/:id",listingValidation,wrapAsync(async (req,res)=>{ 
  let {id} = req.params;
  if(!req.body.listing){
  req.flash("error","Listing not exist !");
  return res.redirect("/listing");
  }
  let updatedData  = req.body.listing;
   
  let list = await Listing.findByIdAndUpdate(id,updatedData,{
    runValidators : true, // to donot bypass the validation
    new : true // retuns updated doc in response
  });
  console.log(list);
  if(!list){
  req.flash("error","Listing not found!");
  return res.redirect("/listing");
 }
  //  res.json(list);
  req.flash("success","Listing Edited !");
  res.redirect(`/listing/${id}`);
}));


//Delete Listings
router.delete("/:id",wrapAsync(async (req,res)=>{ 
  let {id} = req.params;
  console.log(id);
  let deleteList = await Listing.findByIdAndDelete(id);
  if(deleteList){
    req.flash("success","Listing Deleted !");
  }
  console.log(deleteList);
  res.redirect("/listing");
}))

module.exports = router ; 