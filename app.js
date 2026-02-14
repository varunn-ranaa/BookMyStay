const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsmate  = require('ejs-mate');
const Listing = require('./models/listing.js');
const { url } = require('inspector');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressError.js');``

const port = 8080;

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs',ejsmate);  // ejs-mate helpful for template inheritance...
app.use(express.static(path.join(__dirname,'/public')));

connect() // connection with DB
.then(res => console.log("Connection Sucessfull !"))
.catch(err => console.log("Connection Failed !"));

app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views"));

async function connect(){
  await mongoose.connect('mongodb://127.0.0.1:27017/BookStay')
}


//All Listings
app.get("/listing",wrapAsync(async (req,res)=>{  
  const lists =  await Listing.find({});
  res.render("listings/index.ejs",{lists});
}));

app.get("/listing/new",(req,res)=>{  
    res.render("listings/new.ejs");
});

app.get("/listing/:id", wrapAsync(async (req,res)=>{
   let {id} = req.params;
   let list = await Listing.findById(id);
   if(!list) throw new ExpressError(404,"Listing not found !")
  res.render("listings/show.ejs",{list});
}));

//New Listings
app.post("/listing",wrapAsync(async (req,res)=>{ 
 
  let list = req.body;
  if(!list) throw new ExpressError(400 , "Send data in req body !");

  let newList = new Listing(list);
  await newList.save();

  res.redirect("/listing");
}));

app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
}));

//Edit Listings
app.patch("/listing/:id",wrapAsync(async (req,res)=>{ 

  let {id} = req.params;
  let data = req.body;

  if(!data){
   throw new ExpressError(400,'All fields are required');
  }

  const allowedFields = [
  "title",
  "description",
  "price",
  "location",
  "country",
  "image"
  ];

  let updateData = {};

  allowedFields.forEach(field => {
   if(data[field] !== undefined){
      updateData[field] = data[field];
   }
  });

  let list = await Listing.findByIdAndUpdate(id,updateData,{
    runValidators : true, // to donot bypass the validation
    new : true // retuns updated doc in response
  });
 
  if(!list){
  throw new ExpressError(404,"Listing not found");
}

  // res.json(list);
  res.redirect(`/listing/${id}`);
}));


//Delete Listings
app.delete("/listing/:id",wrapAsync(async (req,res)=>{ 
  let {id} = req.params;
  console.log(id);
  let deleteList = await Listing.findByIdAndDelete(id);
  console.log(deleteList);
  res.redirect("/listing");
}))

// manage non existed routes
app.use((req,res,next)=>{ 
   throw new ExpressError(404, 'Page Not Found !');
});

 // err handler middleware
app.use((err,req,res,next)=>{ 

   if(err.name === "ValidationError"){
      err.status = 400;
   }

   if(err.code === 11000){   // duplicate key error
      err.status = 400;
      err.message = "Duplicate field value entered";
   }

  let {status = 500 , message='Something went wrong !'} = err;
  res.status(status).send(message);
});

app.listen(port,()=>{
  `Listening at port : ${port}`;
});

