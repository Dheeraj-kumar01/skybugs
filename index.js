if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}



const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./joiSchema");
const Review = require("./models/reviews");
const listingRoutes = require("./routes/listing");
const review = require("./routes/review");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoute = require("./routes/userRoute");


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("public"));
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  }),
);


app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use((req, res, next) => {
  res.locals.successmsg = req.flash("success");
  res.locals.errormsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then((res) => console.log("Database connected"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wonderluts");
}

app.use("/index", listingRoutes);
app.use("/index/:id/review", review);
app.use("/user", userRoute);

app.use("/", (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  let { message, statuscode } = err;
  res.render("listings/error", { message, statuscode });
});

app.listen(8090, () => console.log("server is running on localhost:8090"));
