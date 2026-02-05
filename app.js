const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const { url } = require('inspector');

const port = 8080;

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

connect() // connection with DB
.then(res => console.log("Connection Sucessfull !"))
.catch(err => console.log("Connection Failed !"));

app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views"));

async function connect(){
  await mongoose.connect('mongodb://127.0.0.1:27017/BookStay')
}


app.get("/listing",async (req,res)=>{  //All Listings
  const lists =  await Listing.find({});
  res.render("listings/index.ejs",{lists});
});

app.get("/listing/new",(req,res)=>{  
    res.render("listings/new.ejs");
});

app.get("/listing/:id", async (req,res)=>{
   let {id} = req.params;
   let list = await Listing.findById(id);
  res.render("listings/show.ejs",{list});
});

app.post("/listing", async (req,res)=>{ //New Listings
  let {title,desc,image,price,location,country} = req.body;
  let data ={
  title: title,
  description: desc,   
  price: price,
  image : {
    url : image,
    filename : title
  },
  location: location,
  country: country,
  }
  
  let newList = new Listing(data);
  await newList.save();

  res.redirect("/listing");
});

app.get("/listing/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    res.render("listings/edit.ejs",{list});
});

app.patch("/listing/:id",async (req,res)=>{ //Edit Listings
  let {id} = req.params;
  let {up_title,up_desc,up_image,up_price,up_location,up_country} = req.body;
  let updateData = {
  title: up_title,
  description: up_desc,   
  price: up_price,
  image : {
    url : up_image,
    filename : up_title
  },
  location: up_location,
  country: up_country,
  }

  let list = await Listing.findByIdAndUpdate(id,updateData,{
    runValidators : true, // to donot bypass the validation
    new : true // retuns updated doc in response
  });

  res.redirect(`/listing/${id}`);
});

app.delete("/listing/:id",async (req,res)=>{ //Delete Listings
  let {id} = req.params;
  console.log(id);
  let deleteList = await Listing.findByIdAndDelete(id);
  console.log(deleteList);
  res.redirect("/listing");
})

app.listen(port,()=>{
  `Listening at port : ${port}`;
});

//Note :cast to ObjectId failed for value "new" (type string) at path "_id" for model "Listing"
//This error occurs because Express matches routes in the order they are defined. If you have a route with a parameter like
//  /:id, and it is defined before a static route like /new, Express treats the word "new" as the id value