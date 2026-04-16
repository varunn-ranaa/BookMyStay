if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const MongoStore = require("connect-mongo").default;

const MONGO_URL = process.env.MONGO_URL;
const port = process.env.PORT || 8080;

// ─── DB Connect ───────────────────────────────────────────────
async function connect() {
  await mongoose.connect(MONGO_URL);
}

// ─── View Engine ──────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

// ─── Middlewares ──────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.use((req, res, next) => {
  res.locals.showNavbar = true;
  next();
});

// ─── Mongo Session Store ──────────────────────────────────────
const mongoStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.MONGO_SECRET,
  },
  touchAfter: 24 * 3600,
});

mongoStore.on("error", (err) => {
  console.log("Error in MongoDB Store:", err);
});

// ─── Session ──────────────────────────────────────────────────
app.use(
  session({
    store: mongoStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);

// ─── Flash ────────────────────────────────────────────────────
app.use(flash());

// ─── Passport ─────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ─── Locals ───────────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.reqUrl = req.originalUrl;
  next();
});

// ─── Routes ───────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.redirect("/listing");
});

app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res, next) => {
  throw new ExpressError(404, "Page Not Found !");
});

// ─── Error Handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.status = 400;
  }

  if (err.code === 11000) {
    err.status = 400;
    err.message = "Duplicate field value entered";
  }

  let { status = 500, message = "Something went wrong !" } = err;
  
  res.status(status).render("error.ejs", { err });
});

// ─── Start Server only after DB connects ──────────────────────
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Connection Successful ! Listening at port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("Connection Failed !", err);
    process.exit(1); 
  });
