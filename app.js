if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const ejsmate  = require('ejs-mate');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js')
const { url } = require('inspector');
const ExpressError = require('./utils/expressError.js');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require("./routes/user.js");
 
const port = 8080;

//middlewares
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs',ejsmate);  // ejs-mate helpful for template inheritance...
app.use(express.static(path.join(__dirname,'/public')));

app.use((req, res, next) => {
  res.locals.showNavbar = true;
  next();
});


app.use(session({
   secret : 'mysupersecertkey',
   resave : false,
   saveUninitialized :true,
   cookie :{
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge  : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true, //prevent XSS
   }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // single user req and res is session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   res.locals.currUser = req.user;
   res.locals.reqUrl = req.originalUrl;
   next();
})



// connection with DB
connect() 
.then(res => console.log("Connection Sucessfull !"))
.catch(err => console.log("Connection Failed !"));

app.set("view engine","ejs"); 
app.set("views",path.join(__dirname,"views"));

async function connect(){
  await mongoose.connect('mongodb://127.0.0.1:27017/BookStay')
}

//Listings Route
app.use('/listing', listingRouter);

//Review Route
app.use('/listing/:id/review',reviewRouter);

//user Route
app.use("/",userRouter);



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
  res.status(status).render("error.ejs",{err});

});

app.listen(port,()=>{
  `Listening at port : ${port}`;
});

