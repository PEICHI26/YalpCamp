if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const campgroundsRoute = require("./routes/campgrounds");
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const reqSanitizer = require('req-sanitizer');
const helmet = require("helmet");

//connect to mongodb
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/yalp-camp");
  console.log("connect to mongo");
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

//read ejs file
app.engine("ejs", ejsMate);

//read files from views dir
app.set("views", path.join(__dirname, "views"));
//read ejs file
app.set("view engine", "ejs");

//request from url
app.use(express.urlencoded({ extended: true }));

//override method post to what you need (ex:delete)
app.use(methodOverride("_method"));

//read files from public dir
app.use(express.static(path.join(__dirname, "public")));

// To remove data using these defaults:
app.use(mongoSanitize());

//All  req.body values are sanitized against XSS
app.use(reqSanitizer());

//secure app by setting various HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

//config session
const sessionConfig = {
  secret: "mysecrete",
  resave: false,
  saveUninitialized: true,
  cookie: {
    name: "mycookie",
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};


//use session
app.use(session(sessionConfig));
//use flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", usersRoute);

//add /campgrounds before every campgrounds route
app.use("/campgrounds", campgroundsRoute);

//add /campgrounds/:id/reviews before every campgrounds route
app.use("/campgrounds/:id/reviews", reviewsRoute);


//if any route does not exit, will run this code
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

//every error will end up passing to this code
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("listen on port 3000");
});
