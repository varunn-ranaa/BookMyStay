const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
   title : {
    type : String,
    required : true
   },
   description : {
    type : String,
    required : true
   },
   image : {
      filename : String,
      url :{
      type : String,
      set : (v) => v===""?"default Link": v,   //using setter function
      } 
   },
   price :{
    type : Number,
    required : true
   },
   location : {
    type : String,
    required : true
   },
   country : {
    type : String,
    required : true
   }

})

const Listing = mongoose.model("Listing",listSchema);
module.exports = Listing ;
