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
   if(!list) throw new ExpressError(404,"Listing not found !")
  res.render("listings/show.ejs",{list});
}));

//New Listings
router.post("/",listingValidation,wrapAsync(async (req,res)=>{ 

  let data  = req.body.listing;

  let newList = new Listing(data);
  console.log(newList);

  await newList.save();

  res.redirect("/listing");
}));

router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
}));



//Edit Listings
router.patch("/:id",listingValidation,wrapAsync(async (req,res)=>{ 

  let {id} = req.params;
  let updatedData  = req.body.listing;
   
  let list = await Listing.findByIdAndUpdate(id,updatedData,{
    runValidators : true, // to donot bypass the validation
    new : true // retuns updated doc in response
  });
  console.log(list);
  if(!list){
  throw new ExpressError(404,"Listing not found");
}

  //  res.json(list);
  res.redirect(`/listing/${id}`);
}));


//Delete Listings
router.delete("/:id",wrapAsync(async (req,res)=>{ 
  let {id} = req.params;
  console.log(id);
  let deleteList = await Listing.findByIdAndDelete(id);
  console.log(deleteList);
  res.redirect("/listing");
}))

module.exports = router ; 