const User = require("../models/user");

module.exports.newRegister = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "welcome");
      res.redirect("/campgrounds");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("register");
  }
};

module.exports.newLogin = (req, res) => {
  req.flash("success", "Welcome");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};

module.exports.loginForm = (req, res) => {
  res.render("users/login");
};

module.exports.registerForm = (req, res) => {
    res.render("users/register");
  }
