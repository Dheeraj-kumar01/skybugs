const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveredirectUrl } = require("../middlewares.js");
const {
  signUpFrom,
  signUpUser,
  logInFrom,
  logInUser,
  logoutUser,
} = require("../controllers/user.js");

router
.route("/signUp")
.get(signUpFrom)
.post(saveredirectUrl, signUpUser);

router.route("/login")
.get(logInFrom)
.post(
  saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: true,
  }),
  logInUser,
);

//logout users
router.get("/logout", logoutUser);

module.exports = router;
