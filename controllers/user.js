const User = require("../models/user.js");

//this is for signUp user from
module.exports.signUpFrom = (req, res) => {
  res.render("users/signUp");
};

//this is for signUp user
module.exports.signUpUser = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    const newUser = new User({
      username: username,
      email: email,
    });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to skybug");
      res.redirect(res.locals.redirectTo || "/index");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/user/signUp");
  }
};

//this is for logIn user from
module.exports.logInFrom = (req, res) => {
  res.render("users/login");
};

//this is for logIn user
module.exports.logInUser = async (req, res, next) => {
  try {
    req.flash("success", "Successfully logged in");
    res.redirect(res.locals.redirectTo || "/index");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/user/login");
  }
};

//this is from logOut
module.exports.logoutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully you are logged out");
    res.redirect("/index");
  });
};
