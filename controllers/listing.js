const Listing = require('../models/listing.js');
const ExpressError = require('../utils/expressError.js');

module.exports.index = async (req,res)=>{  
  const lists =  await Listing.find({});
  res.render("listings/index.ejs",{lists});
}

module.exports.renderNewForm = (req,res)=>{  
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
   let {id} = req.params;
   let list = await Listing.findById(id).populate({path : "review" , populate :{ path : "owner" }}).populate("owner");
   
  if(!list){
    req.flash("error"," Listing does not found !");
    return res.redirect("/listing");
   }
  res.render("listings/show.ejs",{list});
}

module.exports.newListing = async (req,res)=>{ 

  let data  = req.body.listing;

  let newList = new Listing(data);
  newList.owner = req.user._id;
  console.log(newList);

  await newList.save();
  req.flash("success"," New Listing Added !");
  res.redirect("/listing");
}

module.exports.editForm = async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
  if(!list){
  req.flash("error","Listing not found!");
  return res.redirect("/listing");
  }    
    res.render("listings/edit.ejs",{list});
}

module.exports.editListing = async (req,res)=>{ 
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
}

module.exports.deleteListing = async (req,res)=>{ 
  let {id} = req.params;
  console.log(id);
  let deleteList = await Listing.findByIdAndDelete(id);
  if(deleteList){
    req.flash("success","Listing Deleted !");
  }
  console.log(deleteList);
  res.redirect("/listing");
}